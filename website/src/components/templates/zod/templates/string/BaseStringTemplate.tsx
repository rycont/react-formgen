import React from 'react'
import type * as z from 'zod/v4/core'
import { getMetadata } from '@react-formgen/zod'
import { TextareaTemplate } from './TextareaTemplate'
import { InputTemplate } from './InputTemplate'

/**
 * Template matcher configuration for efficient template selection
 */
interface TemplateMatcher<T> {
  matcher: (schema: T) => boolean
  render: () => React.ReactElement
}

/**
 * Interface for Zod string schema definitions with format support
 */
interface StringSchemaDef extends z.$ZodTypeDef {
  checks?: z.$ZodCheck[]
  format?: string
}

/**
 * BaseStringTemplate
 * Handles switching between input and textarea fields based on schema metadata and uiSchema.
 * Unlike JSON Schema templates, this doesn't handle enums/unions as those are handled by separate templates.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the string property.
 * @param {string[]} props.path - The path to the string property in the form data.
 * @returns {JSX.Element} - The string template component.
 */
export const BaseStringTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const metadata = getMetadata(schema)

  // Type-safe access to schema internals
  const typedSchema = schema as z.$ZodTypes
  const schemaDef = typedSchema._zod.def as StringSchemaDef
  const format = schemaDef.format as string | undefined

  const stringMatchers: TemplateMatcher<z.$ZodType>[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: () => {
        return metadata.uiSchema?.component === 'textarea'
      },
      render: () => <TextareaTemplate schema={schema} path={path} />,
    },

    // Format-based logic for specific input types
    {
      matcher: () => {
        return Boolean(
          schemaDef.format && ['date', 'datetime'].includes(schemaDef.format),
        )
      },
      render: () => {
        const inputType = format === 'datetime' ? 'datetime-local' : format
        return (
          <InputTemplate schema={schema} path={path} htmlType={inputType} />
        )
      },
    },
    {
      matcher: () => {
        return schemaDef.format === 'email'
      },
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="email" />
      ),
    },
    {
      matcher: () => {
        return schemaDef.format === 'url'
      },
      render: () => (
        <InputTemplate schema={schema} path={path} htmlType="url" />
      ),
    },

    // Fallback to input template
    {
      matcher: () => true,
      render: () => <InputTemplate schema={schema} path={path} />,
    },
  ]

  // Find the first matching template and render it
  const matchedTemplate = stringMatchers.find(({ matcher }) => matcher(schema))
  return (
    matchedTemplate?.render() ?? <InputTemplate schema={schema} path={path} />
  )
}
