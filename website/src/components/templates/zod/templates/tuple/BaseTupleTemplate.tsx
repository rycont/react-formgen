import React from 'react'
import type * as z from 'zod/v4/core'
import { SimpleTupleTemplate } from './SimpleTupleTemplate'

/**
 * BaseTupleTemplate
 * Renders a tuple schema by delegating to the appropriate template.
 * For now, we only have SimpleTupleTemplate, but this allows for future extensions.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema of the tuple.
 * @param {string[]} props.path - The path to the tuple in the form data.
 * @returns {JSX.Element} - The tuple template component.
 */
export const BaseTupleTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  return <SimpleTupleTemplate schema={schema} path={path} />
}
