"use server";

import { z } from "zod";
import type { InquiryActionState } from "@/lib/inquiry-action-state";
import { createClient } from "@/lib/supabase/server";

const inquirySchema = z.object({
  customer_name: z.string().trim().min(1, "Enter your name.").max(160, "Name must be 160 characters or fewer."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address.").max(320, "Email must be 320 characters or fewer.")),
  phone: z.string().trim().max(40, "Phone must be 40 characters or fewer."),
  city: z.string().trim().max(120, "City must be 120 characters or fewer."),
  service_id: z.union([z.literal(""), z.uuid("Choose a listed service.")]),
  message: z.string().trim().max(4000, "Message must be 4,000 characters or fewer."),
});

function getTextField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitInquiry(
  _previousState: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  if (getTextField(formData, "website").trim()) {
    return {
      message: "We couldn't submit your request. Please refresh the page and try again.",
    };
  }

  const result = inquirySchema.safeParse({
    customer_name: getTextField(formData, "customer_name"),
    email: getTextField(formData, "email"),
    phone: getTextField(formData, "phone"),
    city: getTextField(formData, "city"),
    service_id: getTextField(formData, "service_id"),
    message: getTextField(formData, "message"),
  });

  if (!result.success) {
    return {
      fieldErrors: z.flattenError(result.error).fieldErrors,
      message: "Please check the highlighted fields and try again.",
    };
  }

  const supabase = await createClient();
  const serviceId = result.data.service_id || null;

  if (serviceId) {
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id")
      .eq("id", serviceId)
      .eq("status", "published")
      .maybeSingle();

    if (serviceError) {
      console.error("Unable to verify the selected inquiry service.", {
        code: serviceError.code,
      });
      return {
        message: "We couldn't verify the selected service. Please try again.",
      };
    }

    if (!service) {
      return {
        fieldErrors: {
          service_id: ["Choose a currently available service."],
        },
        message: "Please check the highlighted fields and try again.",
      };
    }
  }

  const { error } = await supabase.from("inquiries").insert({
    customer_name: result.data.customer_name,
    email: result.data.email,
    phone: result.data.phone || null,
    city: result.data.city || null,
    service_id: serviceId,
    message: result.data.message || null,
    privacy_notice_version: "inquiry-notice-2026-10-15-v1",
  });

  if (error) {
    if (error.code === "P0001" && error.message === "recent_inquiry_duplicate") {
      return {
        message:
          "We recently received a request from this email address. Please wait 10 minutes before sending another.",
      };
    }

    console.error("Unable to save an inquiry.", { code: error.code });
    return {
      message:
        "We couldn't save your request right now. Please try again later.",
    };
  }

  return {
    success: true,
    message:
      "Your request was received. The team will follow up to discuss your needs and confirm availability. This is not a confirmed appointment.",
  };
}
