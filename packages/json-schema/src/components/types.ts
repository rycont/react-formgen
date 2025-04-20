import { ErrorObject } from "ajv";
import { JSONSchema7 } from "json-schema";

/**
 * Represents the props for the Form component.
 *
 * @property {JSONSchema7 | FormgenJSONSchema7} schema - The JSON Schema for the form
 * @property {{ [key: string]: unknown }} [initialData] - Initial form data
 * @property {(data: { [key: string]: unknown }) => void} [onSubmit] - Called on successful form submission
 * @property {(errors: ErrorObject[], data?: { [key: string]: unknown }) => void} [onError] - Called when form has validation errors
 * @property {Templates} templates - Custom templates used in rendering type-specific components
 * @property {React.FC<FormRootProps>} formRoot - Custom form root component
 * @property {React.FC<RenderTemplateProps>} [renderTemplate] - Custom template renderer override
 * @property {boolean} [readonly] - Whether to render the form in readonly mode
 * @property {boolean} [enableDevtools] - Whether to enable Zustand devtools for debugging
 */
export type FormProps = {
  schema: JSONSchema7 | FormgenJSONSchema7;
  initialData?: { [key: string]: unknown };
  onSubmit?: (data: { [key: string]: unknown }) => void;
  onError?: (errors: ErrorObject[], data?: { [key: string]: unknown }) => void;
  templates: Templates; // Required
  formRoot: React.FC<FormRootProps>; // Required
  renderTemplate?: React.FC<RenderTemplateProps>;
  readonly?: boolean;
  enableDevtools?: boolean;
};

/**
 * Represents the props for the FormProvider component.
 *
 * @property {JSONSchema7 | FormgenJSONSchema7} schema - The JSON Schema for the form
 * @property {{ [key: string]: unknown }} [initialData] - Initial form data
 * @property {React.ReactNode} children - Child components that will have access to the form context
 * @property {Templates} templates - Custom templates used in rendering type-specific components
 * @property {boolean} [readonly] - Whether to render the form in readonly mode
 * @property {React.FC<RenderTemplateProps>} [renderTemplate] - Optional custom render template function
 * @property {boolean} [enableDevtools] - Whether to enable Zustand devtools for debugging
 */
export type FormProviderProps = {
  schema: JSONSchema7 | FormgenJSONSchema7;
  initialData?: { [key: string]: unknown };
  children: React.ReactNode;
  templates: Templates; // Required
  readonly?: boolean;
  renderTemplate?: React.FC<RenderTemplateProps>;
  enableDevtools?: boolean;
};

/**
 * Represents the props for the FormRoot component.
 * This is the component responsible for rendering the form container, handling form submission,
 * and displaying validation errors.
 *
 * @property {(data: { [key: string]: unknown }) => void} onSubmit - Called on successful form submission
 * @property {(errors: ErrorObject[], data?: { [key: string]: unknown }) => void} onError - Called when form has validation errors
 */
export type FormRootProps = {
  onSubmit: (data: { [key: string]: unknown }) => void;
  onError: (errors: ErrorObject[], data?: { [key: string]: unknown }) => void;
};

/**
 * Represents the UI schema for a property.
 * This can be used to provide UI-specific configuration for a schema property.
 *
 * @property {string} component - The component to use for the property
 * @property {Record<string, unknown>} [props] - The props to pass to the component
 */
export interface UISchema {
  component: string;
  props?: Record<string, unknown>;
}

/**
 * Represents an extended JSONSchema7 with additional properties for customizing forms.
 * This adds form-specific extensions to the standard JSON Schema.
 *
 * @extends {Omit<JSONSchema7, "properties" | "definitions">}
 * @property {UISchema} [uiSchema] - UI-specific configuration
 * @property {Record<string, FormgenJSONSchema7>} [properties] - Object properties
 * @property {Record<string, FormgenJSONSchema7>} [definitions] - Schema definitions
 */
export interface FormgenJSONSchema7
  extends Omit<JSONSchema7, "properties" | "definitions"> {
  uiSchema?: UISchema;
  properties?: Record<string, FormgenJSONSchema7>;
  definitions?: Record<string, FormgenJSONSchema7>;
}

/**
 * Custom OneOf type for strings.
 * Used in the StringSchema to provide multiple-choice options with labels.
 *
 * @property {string} const - The actual string value
 * @property {string} [title] - Display label for the option
 * @property {string} [description] - Optional description for the option
 */
export type StringOneOf = {
  const: string;
  title?: string;
  description?: string;
};

/**
 * Represents a base string schema.
 * This is used as a base for the StringSchema type, for instances where all constraints are not needed.
 *
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"string"} type - The schema type
 */
export interface BaseStringSchema extends Omit<JSONSchema7, "type"> {
  type: "string";
}

/**
 * Represents a fully-featured string schema with additional UI options.
 * Use this type when implementing your StringTemplate component.
 *
 * @extends {Omit<FormgenJSONSchema7, "type" | "enum" | "oneOf">}
 * @property {"string"} type - The schema type
 * @property {string[]} [enum] - Dropdown options
 * @property {StringOneOf[]} [oneOf] - Multiple-choice options with labels
 * @property {UISchema} [uiSchema] - UI-specific configuration
 */
export interface StringSchema
  extends Omit<FormgenJSONSchema7, "type" | "enum" | "oneOf"> {
  type: "string";
  enum?: string[];
  oneOf?: StringOneOf[];
  uiSchema?: UISchema;
}

/**
 * Custom OneOf type for numbers.
 * Used in the NumberSchema to provide multiple-choice options with labels.
 *
 * @property {number} const - The actual numeric value
 * @property {string} [title] - Display label for the option
 * @property {string} [description] - Optional description for the option
 */
export type NumberOneOf = {
  const: number;
  title?: string;
  description?: string;
};

/**
 * Represents a base number schema.
 * This is used as a base for the NumberSchema type, for instances where all constraints are not needed.
 *
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"number" | "integer"} type - The schema type
 */
export interface BaseNumberSchema extends Omit<JSONSchema7, "type"> {
  type: "number" | "integer";
}

/**
 * Represents a fully-featured number schema with additional UI options.
 * Use this type when implementing your NumberTemplate component.
 *
 * @extends {Omit<FormgenJSONSchema7, "type" | "enum" | "oneOf">}
 * @property {"number" | "integer"} type - The schema type
 * @property {number[]} [enum] - Dropdown options
 * @property {NumberOneOf[]} [oneOf] - Multiple-choice options with labels
 * @property {UISchema} [uiSchema] - UI-specific configuration
 */
export interface NumberSchema
  extends Omit<FormgenJSONSchema7, "type" | "enum" | "oneOf"> {
  type: "number" | "integer";
  enum?: number[];
  oneOf?: NumberOneOf[];
  uiSchema?: UISchema;
}

/**
 * Custom OneOf type for booleans.
 * Used in the BooleanSchema to provide labeled boolean options (e.g., "Yes"/"No").
 *
 * @property {boolean} const - The actual boolean value
 * @property {string} [title] - Display label for the option
 */
export type BooleanOneOf = {
  const: boolean;
  title?: string;
};

/**
 * Represents a base boolean schema.
 * This is used as a base for the BooleanSchema type, for instances where all constraints are not needed.
 *
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"boolean"} type - The schema type
 */
export interface BaseBooleanSchema extends Omit<JSONSchema7, "type"> {
  type: "boolean";
}

/**
 * Represents a fully-featured boolean schema with additional UI options.
 * Use this type when implementing your BooleanTemplate component.
 *
 * @extends {Omit<FormgenJSONSchema7, "type" | "oneOf">}
 * @property {"boolean"} type - The schema type
 * @property {BooleanOneOf[]} [oneOf] - Options for rendering as radio buttons with labels
 * @property {UISchema} [uiSchema] - UI-specific configuration
 */
export interface BooleanSchema
  extends Omit<FormgenJSONSchema7, "type" | "oneOf"> {
  type: "boolean";
  oneOf?: BooleanOneOf[];
  uiSchema?: UISchema;
}

/**
 * Represents a base object schema.
 * This is used as a base for the ObjectSchema type, for instances where all constraints are not needed.
 *
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"object"} type - The schema type
 */
export interface BaseObjectSchema extends Omit<JSONSchema7, "type"> {
  type: "object";
}

/**
 * Represents a fully-featured object schema with additional UI options.
 * Use this type when implementing your ObjectTemplate component.
 *
 * @extends {Omit<FormgenJSONSchema7, "type">}
 * @property {"object"} type - The schema type
 * @property {UISchema} [uiSchema] - UI-specific configuration
 */
export interface ObjectSchema extends Omit<FormgenJSONSchema7, "type"> {
  type: "object";
  uiSchema?: UISchema;
}

/**
 * Represents a base array schema.
 * This is used as a base for the ArraySchema type, for instances where all constraints are not needed.
 *
 * @extends {Omit<JSONSchema7, "type">}
 * @property {"array"} type - The schema type
 */
export interface BaseArraySchema extends Omit<JSONSchema7, "type"> {
  type: "array";
}

/**
 * Represents a fully-featured array schema with additional UI options.
 * Use this type when implementing your ArrayTemplate component.
 *
 * @extends {Omit<FormgenJSONSchema7, "type">}
 * @property {"array"} type - The schema type
 * @property {UISchema} [uiSchema] - UI-specific configuration
 */
export interface ArraySchema extends Omit<FormgenJSONSchema7, "type"> {
  type: "array";
  uiSchema?: UISchema;
}

/**
 * Represents the custom templates for each schema type.
 * You MUST provide implementations for all of these template components.
 *
 * @property {React.FC<{ schema: StringSchema; path: string[] }>} StringTemplate - Template for string-schema
 * @property {React.FC<{ schema: NumberSchema; path: string[] }>} NumberTemplate - Template for number-schema
 * @property {React.FC<{ schema: BooleanSchema; path: string[] }>} BooleanTemplate - Template for boolean-schema
 * @property {React.FC<{ schema: ObjectSchema; path: string[] }>} ObjectTemplate - Template for object-schema
 * @property {React.FC<{ schema: ArraySchema; path: string[] }>} ArrayTemplate - Template for array-schema
 */
export type Templates = {
  StringTemplate:
    | React.FC<{ schema: StringSchema; path: string[] }>
    | React.FC<{ schema: BaseStringSchema; path: string[] }>;
  NumberTemplate:
    | React.FC<{ schema: NumberSchema; path: string[] }>
    | React.FC<{ schema: BaseNumberSchema; path: string[] }>;
  BooleanTemplate:
    | React.FC<{ schema: BooleanSchema; path: string[] }>
    | React.FC<{ schema: BaseBooleanSchema; path: string[] }>;
  ObjectTemplate:
    | React.FC<{ schema: ObjectSchema; path: string[] }>
    | React.FC<{ schema: BaseObjectSchema; path: string[] }>;
  ArrayTemplate:
    | React.FC<{ schema: ArraySchema; path: string[] }>
    | React.FC<{ schema: BaseArraySchema; path: string[] }>;
};

/**
 * Props for the RenderTemplate component.
 * This component is responsible for rendering the correct template based on the schema type.
 *
 * @property {JSONSchema7 | FormgenJSONSchema7} schema - The schema to render
 * @property {string[]} path - The path to the property corresponding to the schema
 */
export interface RenderTemplateProps {
  schema: JSONSchema7 | FormgenJSONSchema7;
  path: string[];
}
