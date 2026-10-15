export type InquiryField =
  | "customer_name"
  | "email"
  | "phone"
  | "city"
  | "service_id"
  | "message";

export type InquiryActionState = {
  fieldErrors?: Partial<Record<InquiryField, string[]>>;
  message?: string;
  success?: boolean;
};
