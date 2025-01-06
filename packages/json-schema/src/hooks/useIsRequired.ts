import { JSONSchema7 } from "json-schema";
import { FormgenJSONSchema7, useFormContext } from "..";
import { resolveSchema } from "../utils";

/**
 * Hook to check if a specific field is required in the form schema.
 * @param path - Array of strings representing the path to the field.
 * @returns `true` if the field is required, `false` otherwise.
 */
export const useIsRequired = (path: string[]): boolean => {
  const rootSchema = useFormContext((state) => state.schema);

  const getParentSchemaAndKey = (
    schema: JSONSchema7 | FormgenJSONSchema7,
    path: string[]
  ): {
    parentSchema: JSONSchema7 | FormgenJSONSchema7 | null;
    key: string | null;
    isTupleItem: boolean;
  } => {
    let currentSchema = schema;

    for (const key of path.slice(0, -1)) {
      if (currentSchema.type === "object" && currentSchema.properties) {
        const propertySchema = resolveSchema(
          currentSchema.properties[key] as JSONSchema7,
          schema.definitions
        );
        currentSchema = propertySchema;
      } else if (currentSchema.type === "array" && currentSchema.items) {
        if (Array.isArray(currentSchema.items)) {
          const index = parseInt(key, 10);
          if (!isNaN(index) && currentSchema.items[index]) {
            currentSchema = resolveSchema(
              currentSchema.items[index] as JSONSchema7,
              schema.definitions
            );
          } else {
            return { parentSchema: null, key: null, isTupleItem: false };
          }
        } else {
          currentSchema = resolveSchema(
            currentSchema.items as JSONSchema7,
            schema.definitions
          );
        }
      } else {
        return { parentSchema: null, key: null, isTupleItem: false };
      }
    }

    return {
      parentSchema: currentSchema,
      key: path[path.length - 1],
      isTupleItem: Array.isArray(currentSchema?.items),
    };
  };

  try {
    const { parentSchema, key, isTupleItem } = getParentSchemaAndKey(
      rootSchema,
      path
    );

    if (isTupleItem) {
      // If it's a tuple item, it's inherently required
      return true;
    }

    if (
      parentSchema &&
      parentSchema.type === "object" &&
      Array.isArray(parentSchema.required) &&
      key
    ) {
      return parentSchema.required.includes(key);
    }

    return false;
  } catch (error) {
    console.error("Error determining if field is required:", error);
    return false;
  }
};
