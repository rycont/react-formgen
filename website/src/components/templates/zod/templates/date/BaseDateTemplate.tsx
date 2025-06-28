import React from 'react'
import type * as z from 'zod/v4/core'
import { getMetadata, unwrapSchema } from '@react-formgen/zod'
import { RangeDateTemplate } from './RangeDateTemplate'
import { DateInputTemplate } from './DateInputTemplate'
import { DateTimeInputTemplate } from './DateTimeInputTemplate'

/**
 * Template matcher configuration for efficient template selection
 */
interface TemplateMatcher {
  matcher: () => boolean
  render: () => React.ReactElement
}

/**
 * Helper function to check if a schema has both min and max constraints for range input
 * @param schema - The Zod schema to check
 * @returns Boolean indicating if the schema has both min and max
 */
function hasMinAndMax(schema: z.$ZodType): boolean {
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodDate
  const bag = unwrappedSchema._zod.bag

  return bag?.minimum instanceof Date && bag?.maximum instanceof Date
}

/**
 * BaseDateTemplate
 * Handles switching between range, date, and datetime inputs based on schema constraints and uiSchema.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the date property.
 * @param {string[]} props.path - The path to the date property in the form data.
 * @returns {JSX.Element} - The date template component.
 */
export const BaseDateTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const metadata = getMetadata(schema)

  const dateMatchers: TemplateMatcher[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: () =>
        metadata.uiSchema?.component === 'range' && hasMinAndMax(schema),
      render: () => <RangeDateTemplate schema={schema} path={path} />,
    },
    {
      matcher: () => metadata.uiSchema?.component === 'datetime',
      render: () => <DateTimeInputTemplate schema={schema} path={path} />,
    },

    // Auto-detect range based on min/max constraints
    {
      matcher: () => hasMinAndMax(schema),
      render: () => <RangeDateTemplate schema={schema} path={path} />,
    },

    // Fallback to date input
    {
      matcher: () => true,
      render: () => <DateInputTemplate schema={schema} path={path} />,
    },
  ]

  // Find the first matching template and render it
  const matchedTemplate = dateMatchers.find(({ matcher }) => matcher())
  return (
    matchedTemplate?.render() ?? (
      <DateInputTemplate schema={schema} path={path} />
    )
  )
}
