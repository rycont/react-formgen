import React from 'react'
import type * as z from 'zod/v4/core'
import {
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
} from '@react-formgen/zod'
import { getMetadata, isRequired } from '@react-formgen/zod'

/**
 * ReadonlyInputTemplate
 * Renders a readonly input display for form preview mode.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The field title/label.
 * @param {string | number | boolean} [props.value] - The current value.
 * @param {string} [props.description] - The field description.
 * @returns {JSX.Element} - The readonly input component.
 */
export const ReadonlyInputTemplate: React.FC<{
  title?: string
  value?: string | number | boolean
  description?: string
}> = ({ title, value, description }) => {
  return (
    <div className="flex w-full flex-col space-y-1">
      {title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </label>
      )}
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
        {value ?? 'N/A'}
      </div>
      {description && (
        <small className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </small>
      )}
    </div>
  )
}

/**
 * InputTemplate
 * Renders a text input field for string schemas using Zod.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the input field.
 * @param {string[]} props.path - The path to the input field in the form data.
 * @param {string} [props.htmlType] - The HTML input type (default: "text").
 * @returns {JSX.Element} - The input field component.
 */
export const InputTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
  htmlType?: string
}> = ({ schema, path, htmlType = 'text' }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  if (readonly) {
    return (
      <ReadonlyInputTemplate
        title={metadata.title}
        value={valueAtPath}
        description={metadata.description}
      />
    )
  }

  /**
   * Handles input value changes
   * @param event - The input change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setValueAtPath(value === '' ? undefined : value)
  }

  // Get error styling classes
  const errorClasses =
    errorsAtPath && errorsAtPath.length > 0
      ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'

  return (
    <div className="flex w-full flex-col space-y-2">
      {metadata.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {metadata.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        type={htmlType}
        value={valueAtPath ?? ''}
        onChange={handleChange}
        className={`rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-offset-gray-900 ${errorClasses} `
          .replace(/\s+/g, ' ')
          .trim()}
        placeholder={
          metadata.description ||
          `Enter ${htmlType === 'email' ? 'email' : htmlType === 'url' ? 'URL' : 'text'}...`
        }
      />

      {metadata.description && (
        <small className="text-xs text-gray-500 dark:text-gray-400">
          {metadata.description}
        </small>
      )}

      {errorsAtPath && errorsAtPath.length > 0 && (
        <div className="text-xs text-red-600 dark:text-red-400">
          {errorsAtPath.map((error, index) => (
            <div key={index}>{error.message}</div>
          ))}
        </div>
      )}
    </div>
  )
}
