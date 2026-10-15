"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { InquiryActionState } from "@/lib/inquiry-action-state";
import { getStaffSession, requireInquiryStaff } from "@/lib/staff-auth";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(320)),
  password: z.string().min(1).max(256),
});

const inquiryUpdateSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "contacted", "quoted", "scheduled", "closed"]),
  staff_notes: z.string().trim().max(8000),
});

export type StaffActionState = {
  message?: string;
  success?: boolean;
};

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function signInStaff(
  _previousState: StaffActionState,
  formData: FormData,
): Promise<StaffActionState> {
  const credentials = credentialsSchema.safeParse({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password"),
  });

  if (!credentials.success) {
    return { message: "Enter a valid email address and password." };
  }

  const { supabase } = await getStaffSession();
  const { error: signInError } = await supabase.auth.signInWithPassword(
    credentials.data,
  );

  if (signInError) {
    return {
      message: "Sign-in failed. Check your credentials and try again.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Unable to verify the signed-in staff user.", {
      code: userError.code,
    });
    await supabase.auth.signOut();
    return { message: "We couldn't verify your staff access. Try again." };
  }

  if (!user) {
    await supabase.auth.signOut();
    return { message: "We couldn't verify your staff access. Try again." };
  }

  const { data: staffRole, error: roleError } = await supabase
    .from("staff_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (roleError) {
    console.error("Unable to load the signed-in user's staff role.", {
      code: roleError.code,
    });
    await supabase.auth.signOut();
    return { message: "We couldn't verify your staff access. Try again." };
  }

  if (
    staffRole?.role !== "admin" &&
    staffRole?.role !== "inquiry_manager" &&
    staffRole?.role !== "content_editor"
  ) {
    await supabase.auth.signOut();
    return {
      message: "This account does not have staff access.",
    };
  }

  redirect(staffRole.role === "content_editor" ? "/admin/content" : "/admin");
}

export async function signOutStaff() {
  const { supabase } = await getStaffSession();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Unable to sign out the staff user.", { code: error.code });
    throw new Error("Unable to sign out. Please try again.", { cause: error });
  }

  redirect("/admin/login");
}

export async function updateInquiry(
  _previousState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  const input = inquiryUpdateSchema.safeParse({
    id: getFormValue(formData, "id"),
    status: getFormValue(formData, "status"),
    staff_notes: getFormValue(formData, "staff_notes"),
  });

  if (!input.success) {
    return { message: "Review the status and notes, then try again." };
  }

  const { supabase, user } = await requireInquiryStaff();
  const { data: updatedInquiry, error } = await supabase
    .from("inquiries")
    .update({
      status: input.data.status,
      staff_notes: input.data.staff_notes || null,
      updated_by: user.id,
    })
    .eq("id", input.data.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Unable to update an inquiry.", { code: error.code });
    return {
      message: "The inquiry could not be updated. Please try again.",
    };
  }

  if (!updatedInquiry) {
    return {
      message: "This inquiry is unavailable or you no longer have permission to update it.",
    };
  }

  return { success: true, message: "Inquiry updated." };
}
