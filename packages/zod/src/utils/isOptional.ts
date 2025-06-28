import type * as z from "zod/v4/core";

/**
 * Checks if a schema is optional at any level of wrapping
 * @param schema - The schema to check
 * @returns True if the schema is optional
 */
export function isOptional(schema: z.$ZodType): boolean {
  const typedSchema = schema as z.$ZodTypes;
  const def = typedSchema._zod.def;

  if (def.type === "optional") return true;

  // Check nested wrappers
  if (
    def.type === "default" ||
    def.type === "prefault" ||
    def.type === "nullable" ||
    def.type === "readonly"
  ) {
    const innerSchema = typedSchema as
      | z.$ZodDefault
      | z.$ZodPrefault
      | z.$ZodNullable
      | z.$ZodReadonly;
    return isOptional(innerSchema._zod.def.innerType);
  }

  return false;
}
