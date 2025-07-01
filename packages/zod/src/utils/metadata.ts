import type * as z from "zod/v4/core";
import { $ZodTypeWithMeta, SchemaMetadata } from "../components";

/**
 * Type guard to check if a schema has the meta method
 */
export function hasMeta(schema: z.$ZodType): schema is $ZodTypeWithMeta {
  return typeof (schema as $ZodTypeWithMeta).meta === "function";
}

/**
 * Safely get metadata from a schema
 */
export function getMetadata(schema: z.$ZodType): SchemaMetadata {
  if (hasMeta(schema)) {
    return schema.meta();
  }
  return {};
}
