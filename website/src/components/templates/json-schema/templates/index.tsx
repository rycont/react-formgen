import React from "react";
import {
  StringSchema,
  ArraySchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  FormgenJSONSchema7,
  Templates,
} from "@react-formgen/json-schema";

import { MultiSelectCheckboxTemplate } from "./array/MultiSelectCheckboxTemplate";
// import { MultiSelectTemplate } from './array/MultiSelectTemplate' // Not in use, just for reference
import { SimpleArrayTemplate } from "./array/SimpleArrayTemplate";
import { TupleArrayTemplate } from "./array/TupleArrayTemplate";
import { CheckboxTemplate } from "./boolean/CheckboxTemplate";
import { RadioTemplate } from "./boolean/RadioTemplate";
import { SimpleObjectTemplate } from "./object/SimpleObjectTemplate";
// import { TextareaTemplate } from './string/TextareaTemplate' // Not in use, just for reference
import { InputTemplate } from "./union/InputTemplate";
// import { MultipleChoiceTemplate } from './union/MultipleChoiceTemplate' // Not in use, just for reference
import { SelectTemplate } from "./union/SelectTemplate";

/**
 * BaseStringTemplate
 * Handles switching between input, select, and date fields based on schema metadata.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the string property.
 * @param {string[]} props.path - The path to the string property in the form data.
 * @returns {JSX.Element} - The string template component.
 */
export const BaseStringTemplate: React.FC<{
  schema: StringSchema;
  path: string[];
}> = ({ schema, path }) => {
  const stringMatchers = [
    {
      matcher: (schema: StringSchema) => schema.enum || schema.oneOf,
      render: () => <SelectTemplate schema={schema} path={path} />,
      // Alternative render method
      // render: () => (
      //   <MultipleChoiceTemplate schema={schema} path={path} />
      // ),
    },
    {
      matcher: (schema: StringSchema) =>
        schema.format && ["date", "date-time"].includes(schema.format),
      render: () => (
        <InputTemplate
          schema={schema}
          path={path}
          htmlType={
            schema.format === "date-time" ? "datetime-local" : schema.format
          }
        />
      ),
    },
    {
      matcher: (schema: StringSchema) => schema.format === "email",
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="email" />
      ),
    },
    {
      matcher: (schema: StringSchema) => schema.format === "uri",
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="url" />
      ),
    },
    {
      matcher: () => true,
      render: () => <InputTemplate schema={schema} path={path} />,
    },
  ];

  for (const { matcher, render } of stringMatchers) {
    if (matcher(schema)) {
      return render();
    }
  }
  return <InputTemplate schema={schema} path={path} />;
};

/**
 * BaseNumberTemplate
 * Renders a number input or select field based on the number schema.
 * @param {Object} props - The props for the component.
 * @param {NumberSchema} props.schema - The schema for the number property.
 * @param {string[]} props.path - The path to the number property in the form data.
 * @returns {JSX.Element} - The number template component.
 */
export const BaseNumberTemplate: React.FC<{
  schema: NumberSchema;
  path: string[];
}> = ({ schema, path }) => {
  const numberMatchers = [
    {
      matcher: (schema: NumberSchema) => schema.enum || schema.oneOf,
      render: () => <SelectTemplate schema={schema} path={path} />,
    },
    {
      matcher: () => true,
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="number" />
      ),
    },
  ];

  for (const { matcher, render } of numberMatchers) {
    if (matcher(schema)) {
      return render();
    }
  }
  return <InputTemplate schema={schema} path={path} htmlType="number" />;
};

/**
 * BaseBooleanTemplate
 * Renders a checkbox or radio buttons for boolean schemas.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the boolean property.
 * @param {string[]} props.path - The path to the boolean property in the form data.
 * @returns {JSX.Element} - The boolean template component.
 */
export const BaseBooleanTemplate: React.FC<{
  schema: BooleanSchema;
  path: string[];
}> = ({ schema, path }) => {
  const booleanMatchers = [
    {
      matcher: (schema: BooleanSchema) => !schema.oneOf,
      render: () => <CheckboxTemplate schema={schema} path={path} />,
    },
    {
      matcher: () => true,
      render: () => <RadioTemplate schema={schema} path={path} />,
    },
  ];

  for (const { matcher, render } of booleanMatchers) {
    if (matcher(schema)) {
      return render();
    }
  }
  return <CheckboxTemplate schema={schema} path={path} />;
};

/**
 * BaseObjectTemplate
 * Renders an object schema by delegating to the appropriate template.
 * @param {Object} props - The props for the component.
 * @param {ObjectSchema} props.schema - The schema of the object.
 * @param {string[]} props.path - The path to the object in the form data.
 * @returns {JSX.Element} - The object template component.
 */
export const BaseObjectTemplate: React.FC<{
  schema: ObjectSchema;
  path: string[];
}> = ({ schema, path }) => {
  return <SimpleObjectTemplate schema={schema} path={path} />;
};

/**
 * BaseArrayTemplate
 * Renders an array field, choosing the appropriate template based on the schema.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The array template component.
 */
export const BaseArrayTemplate: React.FC<{
  schema: ArraySchema;
  path: string[];
}> = ({ schema, path }) => {
  const arrayMatchers = [
    {
      matcher: (schema: ArraySchema) => Array.isArray(schema.items),
      render: () => <TupleArrayTemplate schema={schema} path={path} />,
    },
    {
      matcher: (schema: ArraySchema) =>
        schema.uniqueItems &&
        schema.items &&
        !Array.isArray(schema.items) &&
        typeof schema.items === "object" &&
        ((schema.items as FormgenJSONSchema7).enum ||
          (schema.items as FormgenJSONSchema7).oneOf),
      render: () => <MultiSelectCheckboxTemplate schema={schema} path={path} />,
    },
    {
      matcher: () => true,
      render: () => <SimpleArrayTemplate schema={schema} path={path} />,
    },
  ];

  for (const { matcher, render } of arrayMatchers) {
    if (matcher(schema)) {
      return render();
    }
  }

  return <SimpleArrayTemplate schema={schema} path={path} />;
};

export const BaseTemplates: Templates = {
  StringTemplate: BaseStringTemplate,
  NumberTemplate: BaseNumberTemplate,
  BooleanTemplate: BaseBooleanTemplate,
  ObjectTemplate: BaseObjectTemplate,
  ArrayTemplate: BaseArrayTemplate,
};
