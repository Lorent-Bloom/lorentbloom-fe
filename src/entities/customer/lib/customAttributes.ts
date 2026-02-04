import type { Customer } from "../api/model/entity";

/**
 * Get a specific custom attribute value from customer data
 * @param customer - Customer object with optional custom_attributes
 * @param code - Attribute code to search for (e.g., "company_name")
 * @returns The attribute value or undefined if not found
 */
export function getCustomAttributeValue(
  customer: Customer | null | undefined,
  code: string,
): string | undefined {
  if (!customer?.custom_attributes) {
    return undefined;
  }

  const attribute = customer.custom_attributes.find(
    (attr) => attr.code === code,
  );

  return attribute?.value;
}

/**
 * Build custom attributes input array from a key-value object
 * @param data - Object with attribute codes as keys and values as strings
 * @returns Array of custom attribute objects ready for GraphQL mutation
 * @example
 * buildCustomAttributesInput({ company_name: "Acme", company_phone: "+123" })
 * // Returns: [{ attribute_code: "company_name", value: "Acme" }, ...]
 */
export function buildCustomAttributesInput(
  data: Record<string, string>,
): { attribute_code: string; value: string }[] {
  return Object.entries(data).map(([attribute_code, value]) => ({
    attribute_code,
    value,
  }));
}
