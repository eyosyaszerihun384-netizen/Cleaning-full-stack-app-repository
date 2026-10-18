import { z } from "zod";

export const inquirySchema = z.object({
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

export type InquiryInput = z.infer<typeof inquirySchema>;
