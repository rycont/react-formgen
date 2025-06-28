import React from 'react'
import {
  StringSchema,
  ArraySchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  FormgenJSONSchema7,
  Templates,
} from '@react-formgen/json-schema'

import { MultiSelectCheckboxTemplate } from './array/MultiSelectCheckboxTemplate'
import { MultiSelectTemplate } from './array/MultiSelectTemplate'
import { SimpleArrayTemplate } from './array/SimpleArrayTemplate'
import { TupleArrayTemplate } from './array/TupleArrayTemplate'
import { CheckboxTemplate } from './boolean/CheckboxTemplate'
import { RadioTemplate } from './boolean/RadioTemplate'
import { SimpleObjectTemplate } from './object/SimpleObjectTemplate'
import { TextareaTemplate } from './string/TextareaTemplate'
import { InputTemplate } from './union/InputTemplate'
import { MultipleChoiceTemplate } from './union/MultipleChoiceTemplate'
import { SelectTemplate } from './union/SelectTemplate'
import { RangeNumberTemplate } from './number/RangeNumberTemplate'

/**
 * Template matcher configuration for efficient template selection
 */
interface TemplateMatcher<T> {
  matcher: (schema: T) => boolean
  render: () => React.ReactElement
}

/**
 * BaseStringTemplate
 * Handles switching between input, select, textarea, and radio fields based on schema metadata and uiSchema.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the string property.
 * @param {string[]} props.path - The path to the string property in the form data.
 * @returns {JSX.Element} - The string template component.
 */
export const BaseStringTemplate: React.FC<{
  schema: StringSchema
  path: string[]
}> = ({ schema, path }) => {
  const stringMatchers: TemplateMatcher<StringSchema>[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: (schema) => schema.uiSchema?.component === 'textarea',
      render: () => <TextareaTemplate schema={schema} path={path} />,
    },
    {
      matcher: (schema) => schema.uiSchema?.component === 'multipleChoice',
      render: () => <MultipleChoiceTemplate schema={schema} path={path} />,
    },
    // Default schema-based logic
    {
      matcher: (schema) => Boolean(schema.enum || schema.oneOf),
      render: () => <SelectTemplate schema={schema} path={path} />,
    },
    {
      matcher: (schema) =>
        Boolean(schema.format && ['date', 'date-time'].includes(schema.format)),
      render: () => (
        <InputTemplate
          schema={schema}
          path={path}
          htmlType={
            schema.format === 'date-time' ? 'datetime-local' : schema.format
          }
        />
      ),
    },
    {
      matcher: (schema) => schema.format === 'email',
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="email" />
      ),
    },
    {
      matcher: (schema) => schema.format === 'uri',
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="url" />
      ),
    },
    // Fallback
    {
      matcher: () => true,
      render: () => <InputTemplate schema={schema} path={path} />,
    },
  ]
  // for (const { matcher, render } of stringMatchers) {
  //   if (matcher(schema)) {
  //     return render();
  //   }
  // }
  // return <InputTemplate schema={schema} path={path} />;

  const matchedTemplate = stringMatchers.find(({ matcher }) => matcher(schema))
  return (
    matchedTemplate?.render() ?? <InputTemplate schema={schema} path={path} />
  )
}

/**
 * BaseNumberTemplate
 * Renders a number input or select field based on the number schema and uiSchema.
 * @param {Object} props - The props for the component.
 * @param {NumberSchema} props.schema - The schema for the number property.
 * @param {string[]} props.path - The path to the number property in the form data.
 * @returns {JSX.Element} - The number template component.
 */
export const BaseNumberTemplate: React.FC<{
  schema: NumberSchema
  path: string[]
}> = ({ schema, path }) => {
  const numberMatchers: TemplateMatcher<NumberSchema>[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: (schema) =>
        schema.uiSchema?.component === 'range' &&
        typeof schema.minimum === 'number' &&
        typeof schema.maximum === 'number',
      render: () => (
        <RangeNumberTemplate
          schema={schema as NumberSchema & { minimum: number; maximum: number }}
          path={path}
        />
      ),
    },
    // Default schema-based logic
    {
      matcher: (schema) => Boolean(schema.enum || schema.oneOf),
      render: () => <SelectTemplate schema={schema} path={path} />,
    },
    // Fallback
    {
      matcher: () => true,
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="number" />
      ),
    },
  ]
  // for (const { matcher, render } of numberMatchers) {
  //   if (matcher(schema)) {
  //     return render();
  //   }
  // }
  // return <InputTemplate schema={schema} path={path} htmlType="number" />;

  const matchedTemplate = numberMatchers.find(({ matcher }) => matcher(schema))
  return (
    matchedTemplate?.render() ?? (
      <InputTemplate schema={schema} path={path} htmlType="number" />
    )
  )
}

/**
 * BaseBooleanTemplate
 * Renders a checkbox or radio buttons for boolean schemas based on uiSchema.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the boolean property.
 * @param {string[]} props.path - The path to the boolean property in the form data.
 * @returns {JSX.Element} - The boolean template component.
 */
export const BaseBooleanTemplate: React.FC<{
  schema: BooleanSchema
  path: string[]
}> = ({ schema, path }) => {
  const booleanMatchers: TemplateMatcher<BooleanSchema>[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: (schema) => schema.uiSchema?.component === 'radio',
      render: () => <RadioTemplate schema={schema} path={path} />,
    },
    {
      matcher: (schema) => schema.uiSchema?.component === 'checkbox',
      render: () => <CheckboxTemplate schema={schema} path={path} />,
    },
    // Default schema-based logic
    {
      matcher: (schema) => !schema.oneOf,
      render: () => <CheckboxTemplate schema={schema} path={path} />,
    },
    // Fallback
    {
      matcher: () => true,
      render: () => <RadioTemplate schema={schema} path={path} />,
    },
  ]
  // for (const { matcher, render } of booleanMatchers) {
  //   if (matcher(schema)) {
  //     return render();
  //   }
  // }
  // return <CheckboxTemplate schema={schema} path={path} />;

  const matchedTemplate = booleanMatchers.find(({ matcher }) => matcher(schema))
  return (
    matchedTemplate?.render() ?? (
      <CheckboxTemplate schema={schema} path={path} />
    )
  )
}

/**
 * BaseObjectTemplate
 * Renders an object schema by delegating to the appropriate template.
 * @param {Object} props - The props for the component.
 * @param {ObjectSchema} props.schema - The schema of the object.
 * @param {string[]} props.path - The path to the object in the form data.
 * @returns {JSX.Element} - The object template component.
 */
export const BaseObjectTemplate: React.FC<{
  schema: ObjectSchema
  path: string[]
}> = ({ schema, path }) => {
  return <SimpleObjectTemplate schema={schema} path={path} />
}

/**
 * BaseArrayTemplate
 * Renders an array field, choosing the appropriate template based on the schema and uiSchema.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The array template component.
 */
export const BaseArrayTemplate: React.FC<{
  schema: ArraySchema
  path: string[]
}> = ({ schema, path }) => {
  const arrayMatchers: TemplateMatcher<ArraySchema>[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: (schema) => schema.uiSchema?.component === 'multiSelect',
      render: () => <MultiSelectTemplate schema={schema} path={path} />,
    },
    // Default schema-based logic
    {
      matcher: (schema) => Array.isArray(schema.items),
      render: () => <TupleArrayTemplate schema={schema} path={path} />,
    },
    {
      matcher: (schema) =>
        Boolean(
          schema.uniqueItems &&
            schema.items &&
            !Array.isArray(schema.items) &&
            typeof schema.items === 'object' &&
            ((schema.items as FormgenJSONSchema7).enum ||
              (schema.items as FormgenJSONSchema7).oneOf),
        ),
      render: () => <MultiSelectCheckboxTemplate schema={schema} path={path} />,
    },
    // Fallback
    {
      matcher: () => true,
      render: () => <SimpleArrayTemplate schema={schema} path={path} />,
    },
  ]

  // for (const { matcher, render } of arrayMatchers) {
  //   if (matcher(schema)) {
  //     return render();
  //   }
  // }

  // return <SimpleArrayTemplate schema={schema} path={path} />;
  const matchedTemplate = arrayMatchers.find(({ matcher }) => matcher(schema))
  return (
    matchedTemplate?.render() ?? (
      <SimpleArrayTemplate schema={schema} path={path} />
    )
  )
}

/**
 * Base templates configuration for the form system
 * Provides default template implementations for all schema types
 */
export const BaseTemplates: Templates = {
  StringTemplate: BaseStringTemplate,
  NumberTemplate: BaseNumberTemplate,
  BooleanTemplate: BaseBooleanTemplate,
  ObjectTemplate: BaseObjectTemplate,
  ArrayTemplate: BaseArrayTemplate,
}
