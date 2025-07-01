import React from 'react'
import type * as z from 'zod/v4/core'
import { SimpleObjectTemplate } from './SimpleObjectTemplate'

/**
 * BaseObjectTemplate
 * Renders an object schema by delegating to the appropriate template.
 * For now, we only have SimpleObjectTemplate, but this allows for future extensions.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema of the object.
 * @param {string[]} props.path - The path to the object in the form data.
 * @returns {JSX.Element} - The object template component.
 */
export const BaseObjectTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  return <SimpleObjectTemplate schema={schema} path={path} />
}
