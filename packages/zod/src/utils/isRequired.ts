import type * as z from "zod/v4/core";

/**
 * Checks if a field is required
 */
export function isRequired(schema: z.$ZodType): boolean {
  const typedSchema = schema as z.$ZodTypes;
  const def = typedSchema._zod.def;

  // Check if it's wrapped in optional
  if (def.type === "optional") return false;

  // Check nested wrappers
  if (
    def.type === "nullable" ||
    def.type === "default" ||
    def.type === "readonly"
  ) {
    const innerSchema = typedSchema as
      | z.$ZodNullable
      | z.$ZodDefault
      | z.$ZodReadonly;
    return isRequired(innerSchema._zod.def.innerType);
  }

  return true;
}
