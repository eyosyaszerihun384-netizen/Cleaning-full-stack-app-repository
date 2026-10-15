import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type PublicFaqOption = Pick<
  Database["public"]["Tables"]["faq_options"]["Row"],
  "id" | "label" | "answer" | "next_node_id" | "action"
>;

export type PublicFaqNode = Pick<
  Database["public"]["Tables"]["faq_nodes"]["Row"],
  "id" | "slug" | "prompt" | "is_root"
> & {
  options: PublicFaqOption[];
};

export async function getPublishedFaqTree(): Promise<PublicFaqNode[] | null> {
  const supabase = await createClient();
  const { data: nodes, error: nodesError } = await supabase
    .from("faq_nodes")
    .select("id, slug, prompt, is_root")
    .eq("status", "published")
    .order("sort_order")
    .order("slug");

  if (nodesError) {
    throw new Error("Unable to load the published FAQ.", {
      cause: nodesError,
    });
  }

  if (nodes.length === 0) {
    return null;
  }

  const roots = nodes.filter((node) => node.is_root);
  if (roots.length !== 1) {
    return null;
  }

  const nodeIds = nodes.map((node) => node.id);
  const { data: options, error: optionsError } = await supabase
    .from("faq_options")
    .select("id, node_id, label, answer, next_node_id, action, sort_order")
    .in("node_id", nodeIds)
    .order("sort_order");

  if (optionsError) {
    throw new Error("Unable to load published FAQ choices.", {
      cause: optionsError,
    });
  }

  const tree = nodes.map((node) => ({
    ...node,
    options: options
      .filter((option) => option.node_id === node.id)
      .map(({ id, label, answer, next_node_id, action }) => ({
        id,
        label,
        answer,
        next_node_id,
        action,
      })),
  }));

  const publishedIds = new Set(nodeIds);
  const children = new Map<string, string[]>();
  for (const node of tree) {
    if (node.options.length === 0) return null;
    for (const option of node.options) {
      if (option.next_node_id && !publishedIds.has(option.next_node_id)) {
        return null;
      }
      if (option.next_node_id) {
        children.set(node.id, [...(children.get(node.id) ?? []), option.next_node_id]);
      }
    }
  }

  const active = new Set<string>();
  const reachable = new Set<string>();
  function visit(nodeId: string): boolean {
    if (active.has(nodeId)) return false;
    if (reachable.has(nodeId)) return true;
    active.add(nodeId);
    for (const childId of children.get(nodeId) ?? []) {
      if (!visit(childId)) return false;
    }
    active.delete(nodeId);
    reachable.add(nodeId);
    return true;
  }

  if (!visit(roots[0].id) || reachable.size !== nodes.length) {
    return null;
  }

  return tree;
}
