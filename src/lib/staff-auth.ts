import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type StaffRole = Database["public"]["Enums"]["staff_role"];

export async function getStaffSession() {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error("Unable to read the staff session.", {
      cause: sessionError,
    });
  }

  if (!session) {
    return { supabase, user: null, role: null };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error("Unable to verify the staff session.", {
      cause: authError,
    });
  }

  if (!user) {
    return { supabase, user: null, role: null };
  }

  const { data: staffRole, error: roleError } = await supabase
    .from("staff_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (roleError) {
    throw new Error("Unable to verify staff permissions.", {
      cause: roleError,
    });
  }

  return { supabase, user, role: staffRole?.role ?? null };
}

export async function requireInquiryStaff() {
  const session = await getStaffSession();

  if (!session.user) {
    redirect("/admin/login");
  }

  if (session.role !== "admin" && session.role !== "inquiry_manager") {
    redirect("/admin/login?error=access");
  }

  return {
    supabase: session.supabase,
    user: session.user,
    role: session.role,
  };
}

export async function requireContentStaff() {
  const session = await getStaffSession();

  if (!session.user) {
    redirect("/admin/login");
  }

  if (session.role !== "admin" && session.role !== "content_editor") {
    redirect("/admin/login?error=content");
  }

  return {
    supabase: session.supabase,
    user: session.user,
    role: session.role,
  };
}
