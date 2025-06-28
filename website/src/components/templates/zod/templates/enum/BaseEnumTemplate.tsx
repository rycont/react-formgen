import React from 'react'
import type * as z from 'zod/v4/core'
import { getMetadata } from '@react-formgen/zod'
import { SelectEnumTemplate } from './SelectEnumTemplate'
import { RadioEnumTemplate } from './RadioEnumTemplate'

/**
 * Template matcher configuration for efficient template selection
 */
interface TemplateMatcher {
  matcher: () => boolean
  render: () => React.ReactElement
}

/**
 * BaseEnumTemplate
 * Handles switching between select and radio enum templates based on uiSchema.
 * Default is select dropdown unless uiSchema specifies radio.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the enum property.
 * @param {string[]} props.path - The path to the enum property in the form data.
 * @returns {JSX.Element} - The enum template component.
 */
export const BaseEnumTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const metadata = getMetadata(schema)

  const enumMatchers: TemplateMatcher[] = [
    // uiSchema component override for radio
    {
      matcher: () => metadata.uiSchema?.component === 'radio',
      render: () => <RadioEnumTemplate schema={schema} path={path} />,
    },

    // Default to select dropdown for all other cases
    {
      matcher: () => true,
      render: () => <SelectEnumTemplate schema={schema} path={path} />,
    },
  ]

  // Find the first matching template and render it
  const matchedTemplate = enumMatchers.find(({ matcher }) => matcher())
  return (
    matchedTemplate?.render() ?? (
      <SelectEnumTemplate schema={schema} path={path} />
    )
  )
}
