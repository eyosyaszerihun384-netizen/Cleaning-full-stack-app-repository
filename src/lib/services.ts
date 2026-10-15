import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

export type PublishedService = Pick<
  Database["public"]["Tables"]["services"]["Row"],
  | "id"
  | "slug"
  | "category"
  | "title"
  | "summary"
  | "description"
  | "inclusions"
  | "exclusions"
  | "pricing_display"
  | "image_path"
  | "image_alt"
>;

export function getServiceImageUrl(path: string): string {
  const { url } = getSupabaseConfig();
  const safePath = path.split("/").map(encodeURIComponent).join("/");
  return `${url}/storage/v1/object/public/site-media/${safePath}`;
}

export async function getPublishedServices(): Promise<PublishedService[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, category, title, summary, description, inclusions, exclusions, pricing_display, image_path, image_alt",
    )
    .eq("status", "published")
    .order("sort_order")
    .order("title");

  if (error) {
    throw new Error("Unable to load published services.", { cause: error });
  }

  return data;
}

export async function getPublishedService(
  slug: string,
): Promise<PublishedService | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, category, title, summary, description, inclusions, exclusions, pricing_display, image_path, image_alt",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load the published service "${slug}".`, {
      cause: error,
    });
  }

  return data;
}

export function getStringList(value: Database["public"]["Tables"]["services"]["Row"]["inclusions"]): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}
