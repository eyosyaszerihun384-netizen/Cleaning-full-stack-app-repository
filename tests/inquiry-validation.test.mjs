import assert from "node:assert/strict";
import { test } from "node:test";
import { inquirySchema } from "../src/lib/inquiry-validation.ts";

const validInquiry = {
  customer_name: "Jordan Example",
  email: "jordan@example.invalid",
  phone: "",
  city: "",
  service_id: "",
  message: "",
};

test("accepts a valid inquiry and normalizes name and email", () => {
  const result = inquirySchema.safeParse({
    ...validInquiry,
    customer_name: "  Jordan Example  ",
    email: "  JORDAN@example.invalid  ",
  });

  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.customer_name, "Jordan Example");
  assert.equal(result.data.email, "jordan@example.invalid");
});

test("rejects blank names, malformed email, and invalid service identifiers", () => {
  for (const invalid of [
    { customer_name: "   " },
    { email: "not-an-email" },
    { service_id: "not-a-uuid" },
  ]) {
    assert.equal(
      inquirySchema.safeParse({ ...validInquiry, ...invalid }).success,
      false,
    );
  }
});

test("rejects values beyond the approved form field limits", () => {
  for (const invalid of [
    { customer_name: "a".repeat(161) },
    { email: `${"a".repeat(310)}@example.invalid` },
    { phone: "1".repeat(41) },
    { city: "c".repeat(121) },
    { message: "m".repeat(4001) },
  ]) {
    assert.equal(
      inquirySchema.safeParse({ ...validInquiry, ...invalid }).success,
      false,
    );
  }
});

test("accepts empty optional fields and a UUID service identifier", () => {
  const result = inquirySchema.safeParse({
    ...validInquiry,
    service_id: "123e4567-e89b-42d3-a456-426614174000",
  });

  assert.equal(result.success, true);
});
