import type * as z from "zod/v4/core";

/**
 * Extracts the default value from a schema if it has one
 * @param schema - The original schema (before unwrapping)
 * @returns The default value if present, undefined otherwise
 */
export function getDefaultValue(schema: z.$ZodType): unknown {
  const typedSchema = schema as z.$ZodTypes;
  const def = typedSchema._zod.def;

  if (def.type === "default" || def.type === "prefault") {
    const defaultSchema = typedSchema as z.$ZodDefault;
    const defaultValue = defaultSchema._zod.def.defaultValue;

    if (typeof defaultValue === "function") {
      return defaultValue();
    }
    return defaultValue;
  }

  // Check if this is a wrapper around a default/prefault
  if (
    def.type === "optional" ||
    def.type === "nullable" ||
    def.type === "readonly" ||
    def.type === "nonoptional"
  ) {
    const innerSchema = typedSchema as
      | z.$ZodOptional
      | z.$ZodNullable
      | z.$ZodReadonly
      | z.$ZodNonOptional;
    return getDefaultValue(innerSchema._zod.def.innerType);
  }

  return undefined;
}
