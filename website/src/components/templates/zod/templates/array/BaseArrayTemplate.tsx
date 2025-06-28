import React from 'react'
import type * as z from 'zod/v4/core'
import { getMetadata, unwrapSchema } from '@react-formgen/zod'
import { MultiSelectCheckboxTemplate } from './MultiSelectCheckboxTemplate'
import { MultiSelectTemplate } from './MultiSelectTemplate'
import { SimpleArrayTemplate } from './SimpleArrayTemplate'

/**
 * Template matcher configuration for efficient template selection
 */
interface TemplateMatcher {
  matcher: () => boolean
  render: () => React.ReactElement
}

/**
 * Helper function to check if array element is a union of literals (for multi-select)
 * @param elementSchema - The array element schema to check
 * @returns Boolean indicating if this is a union of literals
 */
function isUnionOfLiterals(elementSchema: z.$ZodType): boolean {
  const unwrappedElement = unwrapSchema(elementSchema)

  if (unwrappedElement._zod.def.type !== 'union') {
    return false
  }

  const unionSchema = unwrappedElement as z.$ZodUnion
  return unionSchema._zod.def.options.every((option: z.$ZodType) => {
    const unwrappedOption = unwrapSchema(option)
    return unwrappedOption._zod.def.type === 'literal'
  })
}

/**
 * BaseArrayTemplate
 * Handles switching between different array templates based on schema and uiSchema.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The array template component.
 */
export const BaseArrayTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const metadata = getMetadata(schema)

  // Extract array element schema
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodArray
  const elementSchema = unwrappedSchema._zod.def.element

  const arrayMatchers: TemplateMatcher[] = [
    // uiSchema component overrides for non-default behavior
    {
      matcher: () =>
        metadata.uiSchema?.component === 'multiSelect' &&
        isUnionOfLiterals(elementSchema),
      render: () => <MultiSelectTemplate schema={schema} path={path} />,
    },
    {
      matcher: () =>
        metadata.uiSchema?.component === 'checkbox' &&
        isUnionOfLiterals(elementSchema),
      render: () => <MultiSelectCheckboxTemplate schema={schema} path={path} />,
    },

    // Auto-detect multi-select for arrays with union of literals
    {
      matcher: () => isUnionOfLiterals(elementSchema),
      render: () => <MultiSelectCheckboxTemplate schema={schema} path={path} />,
    },

    // Fallback to simple array
    {
      matcher: () => true,
      render: () => <SimpleArrayTemplate schema={schema} path={path} />,
    },
  ]

  // Find the first matching template and render it
  const matchedTemplate = arrayMatchers.find(({ matcher }) => matcher())
  return (
    matchedTemplate?.render() ?? (
      <SimpleArrayTemplate schema={schema} path={path} />
    )
  )
}
