import React from "react";
import {
  RenderTemplateProps,
  StringSchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  ArraySchema,
} from "./types";
import { resolveSchema } from "../utils";
import { FormState, useFormContext, useTemplates } from "..";

/**
 * Render a template based on the schema type.
 * @param {RenderTemplateProps} props - The props for the RenderTemplate.
 * @returns {JSX.Element} The rendered template component.
 */
export const RenderTemplate: React.FC<RenderTemplateProps> = ({
  schema,
  path,
}) => {
  // Retrieve definitions from the root schema if available.
  const definitions = useFormContext(
    (state: FormState) => state.schema.definitions || {}
  );

  // Grab custom or default templates from context.
  const {
    StringTemplate,
    NumberTemplate,
    BooleanTemplate,
    ObjectTemplate,
    ArrayTemplate,
  } = useTemplates();

  // First, resolve any $ref references within the schema.
  try {
    schema = resolveSchema(schema, definitions);
  } catch (error) {
    console.error("Error resolving schema:", error);
    return (
      <div style={{ color: "red" }}>
        Failed to resolve schema at path: {path.join("/")}
      </div>
    );
  }

  //  Handle the case where schema.type is an array.
  //  - Common pattern: ["string", "null"] -> a “nullable” string field.
  //  - More complex unions: ["string", "number"], ["object", "array"], etc.
  if (Array.isArray(schema.type)) {
    // Check if it's exactly a two-element array that includes "null"
    // e.g. ["string", "null"] or ["null", "string"]
    if (
      schema.type.length === 2 &&
      schema.type.includes("null") &&
      (schema.type.includes("string") ||
        schema.type.includes("number") ||
        schema.type.includes("boolean") ||
        schema.type.includes("integer"))
    ) {
      // We’ll treat this as a “nullable” scenario.
      // Identify the non-null type:
      const nonNullType = schema.type.find((t) => t !== "null")!;

      // Make a shallow copy of the schema, but force the `type` to the single non-null type.
      // Then recurse by calling RenderTemplate again with the new single-type schema.
      const singleTypeSchema = {
        ...schema,
        type: nonNullType,
      };

      return <RenderTemplate schema={singleTypeSchema} path={path} />;
    } else {
      // We have a more complex union (e.g. ["string", "number"] or more than two types).
      console.error(
        `Unsupported union type at path ${path.join("/")}:`,
        schema.type
      );

      return (
        <div
          style={{
            border: "1px dashed red",
            padding: "1rem",
            color: "red",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <strong>ERROR:</strong> This field has multiple types:
          <ul style={{ marginLeft: "1rem" }}>
            {schema.type.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <small>
            Please provide a specialized UI or a fallback for multi-type fields.
          </small>
        </div>
      );
    }
  }

  // If schema.type is a single type, proceed with switch logic.
  switch (schema.type) {
    case "string":
      return <StringTemplate schema={schema as StringSchema} path={path} />;
    case "integer":
    case "number":
      return <NumberTemplate schema={schema as NumberSchema} path={path} />;
    case "boolean":
      return <BooleanTemplate schema={schema as BooleanSchema} path={path} />;
    case "null":
      // Note: It's rare to see type="null" by itself, but if so, just show a disabled input or similar.
      return <input type="text" value="null" disabled />;
    case "object":
      return <ObjectTemplate schema={schema as ObjectSchema} path={path} />;
    case "array":
      return <ArrayTemplate schema={schema as ArraySchema} path={path} />;
    default:
      // Unknown or unsupported schema type
      console.error(`Unsupported schema type "${schema.type}" at path:`, path);
      return (
        <div
          style={{
            color: "red",
            display: "flex",
            flexDirection: "column",
            border: "1px dashed red",
            padding: "1rem",
          }}
        >
          <strong>ERROR:</strong>
          <small>
            Unsupported schema type `{schema.type || "UNKNOWN"}` at path: `
            {path.join("/")}`
          </small>
        </div>
      );
  }
};
