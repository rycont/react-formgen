import type * as z from "zod/v4/core";
import { $ZodTypeWithMeta, SchemaMetadata } from "../components";

/**
 * Type guard to check for the presence of Zod’s runtime .meta() method
 */
export function hasMeta(schema: z.$ZodType): schema is $ZodTypeWithMeta {
  return typeof (schema as $ZodTypeWithMeta).meta === "function";
}

/**
 * Safely get metadata from a schema
 * Note: this will always returns an object
 * If `.meta({…})` is never called or if Zod returns undefined,
 * fall back to `{}`.
 */
export function getMetadata(schema: z.$ZodType): SchemaMetadata {
  if (!hasMeta(schema)) {
    return {};
  }

  // call .meta(), but guard against it returning undefined
  const meta = (schema as $ZodTypeWithMeta).meta();
  return meta ?? {};
}
