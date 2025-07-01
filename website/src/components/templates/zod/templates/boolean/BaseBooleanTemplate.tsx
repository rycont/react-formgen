import React from 'react'
import type * as z from 'zod/v4/core'
import { getMetadata } from '@react-formgen/zod'
import { CheckboxTemplate } from './CheckboxTemplate'
import { RadioTemplate } from './RadioTemplate'

/**
 * Template matcher configuration for efficient template selection
 */
interface TemplateMatcher {
  matcher: () => boolean
  render: () => React.ReactElement
}

/**
 * BaseBooleanTemplate
 * Handles switching between checkbox and radio button based on uiSchema.
 * Default is checkbox unless uiSchema specifies radio.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the boolean property.
 * @param {string[]} props.path - The path to the boolean property in the form data.
 * @returns {JSX.Element} - The boolean template component.
 */
export const BaseBooleanTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const metadata = getMetadata(schema)

  const booleanMatchers: TemplateMatcher[] = [
    // uiSchema component override for radio
    {
      matcher: () => metadata.uiSchema?.component === 'radio',
      render: () => <RadioTemplate schema={schema} path={path} />,
    },

    // Default to checkbox for all other cases
    {
      matcher: () => true,
      render: () => <CheckboxTemplate schema={schema} path={path} />,
    },
  ]

  // Find the first matching template and render it
  const matchedTemplate = booleanMatchers.find(({ matcher }) => matcher())
  return (
    matchedTemplate?.render() ?? (
      <CheckboxTemplate schema={schema} path={path} />
    )
  )
}
