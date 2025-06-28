import React from 'react'
import type * as z from 'zod/v4/core'
import { getMetadata, unwrapSchema } from '@react-formgen/zod'
import { RangeNumberTemplate } from './RangeNumberTemplate'
import { NumberInputTemplate } from './NumberInputTemplate'

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
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodNumber
  const bag = unwrappedSchema._zod.bag

  return typeof bag?.minimum === 'number' && typeof bag?.maximum === 'number'
}

/**
 * BaseNumberTemplate
 * Handles switching between range and number input based on schema constraints and uiSchema.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the number property.
 * @param {string[]} props.path - The path to the number property in the form data.
 * @returns {JSX.Element} - The number template component.
 */
export const BaseNumberTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const metadata = getMetadata(schema)

  const numberMatchers: TemplateMatcher[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: () =>
        metadata.uiSchema?.component === 'range' && hasMinAndMax(schema),
      render: () => <RangeNumberTemplate schema={schema} path={path} />,
    },

    // Auto-detect range based on min/max constraints
    {
      matcher: () => hasMinAndMax(schema),
      render: () => <RangeNumberTemplate schema={schema} path={path} />,
    },

    // Fallback to number input
    {
      matcher: () => true,
      render: () => <NumberInputTemplate schema={schema} path={path} />,
    },
  ]

  // Find the first matching template and render it
  const matchedTemplate = numberMatchers.find(({ matcher }) => matcher())
  return (
    matchedTemplate?.render() ?? (
      <NumberInputTemplate schema={schema} path={path} />
    )
  )
}
