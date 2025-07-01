import React from 'react'
import type * as z from 'zod/v4/core'
import { getMetadata, unwrapSchema } from '@react-formgen/zod'
import { RangeBigIntTemplate } from './RangeBigIntTemplate'
import { BigIntInputTemplate } from './BigIntInputTemplate'

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
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodBigInt
  const bag = unwrappedSchema._zod.bag

  return typeof bag?.minimum === 'bigint' && typeof bag?.maximum === 'bigint'
}

/**
 * BaseBigIntTemplate
 * Handles switching between range and BigInt input based on schema constraints and uiSchema.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the BigInt property.
 * @param {string[]} props.path - The path to the BigInt property in the form data.
 * @returns {JSX.Element} - The BigInt template component.
 */
export const BaseBigIntTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const metadata = getMetadata(schema)

  const bigintMatchers: TemplateMatcher[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: () =>
        metadata.uiSchema?.component === 'range' && hasMinAndMax(schema),
      render: () => <RangeBigIntTemplate schema={schema} path={path} />,
    },

    // Auto-detect range based on min/max constraints
    {
      matcher: () => hasMinAndMax(schema),
      render: () => <RangeBigIntTemplate schema={schema} path={path} />,
    },

    // Fallback to BigInt input
    {
      matcher: () => true,
      render: () => <BigIntInputTemplate schema={schema} path={path} />,
    },
  ]

  // Find the first matching template and render it
  const matchedTemplate = bigintMatchers.find(({ matcher }) => matcher())
  return (
    matchedTemplate?.render() ?? (
      <BigIntInputTemplate schema={schema} path={path} />
    )
  )
}
