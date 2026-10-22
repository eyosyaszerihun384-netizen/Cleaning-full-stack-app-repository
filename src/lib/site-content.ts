import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/database.types";

export type ActiveServiceArea = Pick<
  Database["public"]["Tables"]["service_areas"]["Row"],
  "id" | "city" | "state" | "postal_codes" | "map_url"
>;

export type PublicContactDetails = {
  email: string | null;
  phone: string | null;
};

export type PublicHomeCopy = {
  eyebrow: string;
  headline: string;
  introduction: string;
};

const defaultHomeCopy: PublicHomeCopy = {
  eyebrow: "Serving Aurora and Denver, Colorado",
  headline: "The right clean for your space.",
  introduction:
    "Regular cleaning focuses on everyday upkeep, such as wiping surfaces, cleaning bathrooms, and vacuuming floors. Deep cleaning is more detailed and targets built-up dirt and areas that may not be included in a standard cleaning. We can help you choose the right service.",
};

const legacyDemoHomeCopy: PublicHomeCopy = {
  eyebrow: "A little more breathing room",
  headline: "Come home to a brighter kind of clean.",
  introduction:
    "Thoughtful home cleaning that gives you back your time—and makes your space feel like your favorite place.",
};

function getJsonString(value: Json, key: string): string | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const field = value[key];
  return typeof field === "string" && field.trim() ? field.trim() : null;
}

export async function getActiveServiceAreas(): Promise<ActiveServiceArea[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_areas")
    .select("id, city, state, postal_codes, map_url")
    .eq("is_active", true)
    .order("sort_order")
    .order("city");

  if (error) {
    throw new Error("Unable to load active service areas.", { cause: error });
  }

  return data;
}

export async function getPublicContactDetails(): Promise<PublicContactDetails> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact")
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load public contact details.", { cause: error });
  }

  const email = data ? getJsonString(data.value, "email") : null;
  const phone = data ? getJsonString(data.value, "phone") : null;

  return {
    email:
      email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
    phone:
      phone && /^\+?[0-9().\-\s]{7,30}$/.test(phone) ? phone : null,
  };
}

export async function getPublicHomeCopy(): Promise<PublicHomeCopy> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "home_copy")
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load public homepage copy.", { cause: error });
  }

  if (!data || typeof data.value !== "object" || data.value === null || Array.isArray(data.value)) {
    return defaultHomeCopy;
  }

  const eyebrow = getJsonString(data.value, "eyebrow");
  const headline = getJsonString(data.value, "headline");
  const introduction = getJsonString(data.value, "introduction");

  return {
    eyebrow:
      eyebrow === legacyDemoHomeCopy.eyebrow
        ? defaultHomeCopy.eyebrow
        : eyebrow ?? defaultHomeCopy.eyebrow,
    headline:
      headline === legacyDemoHomeCopy.headline
        ? defaultHomeCopy.headline
        : headline ?? defaultHomeCopy.headline,
    introduction:
      introduction === legacyDemoHomeCopy.introduction
        ? defaultHomeCopy.introduction
        : introduction ?? defaultHomeCopy.introduction,
  };
}
