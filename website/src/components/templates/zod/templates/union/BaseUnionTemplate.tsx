import React from 'react'
import type * as z from 'zod/v4/core'
import { unwrapSchema } from '@react-formgen/zod'
import { LiteralUnionTemplate } from './LiteralUnionTemplate'
import { ComplexUnionTemplate } from './ComplexUnionTemplate'

/**
 * Template matcher configuration for efficient template selection
 */
interface TemplateMatcher {
  matcher: () => boolean
  render: () => React.ReactElement
}

/**
 * Helper function to check if union contains only literal values
 * @param schema - The union schema to check
 * @returns Boolean indicating if all options are literals
 */
function isLiteralUnion(schema: z.$ZodType): boolean {
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodUnion

  return unwrappedSchema._zod.def.options.every((option: z.$ZodType) => {
    const unwrappedOption = unwrapSchema(option)
    return unwrappedOption._zod.def.type === 'literal'
  })
}

/**
 * BaseUnionTemplate
 * Handles switching between literal and complex union templates.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the union property.
 * @param {string[]} props.path - The path to the union property in the form data.
 * @returns {JSX.Element} - The union template component.
 */
export const BaseUnionTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const unionMatchers: TemplateMatcher[] = [
    // Literal unions get radio buttons
    {
      matcher: () => isLiteralUnion(schema),
      render: () => <LiteralUnionTemplate schema={schema} path={path} />,
    },

    // Complex unions get discriminated union handling
    {
      matcher: () => true,
      render: () => <ComplexUnionTemplate schema={schema} path={path} />,
    },
  ]

  // Find the first matching template and render it
  const matchedTemplate = unionMatchers.find(({ matcher }) => matcher())
  return (
    matchedTemplate?.render() ?? (
      <ComplexUnionTemplate schema={schema} path={path} />
    )
  )
}
