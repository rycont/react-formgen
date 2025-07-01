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
 * ReadonlyDateInputTemplate
 * Renders a readonly date input display for form preview mode.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The field title/label.
 * @param {Date} [props.value] - The current value.
 * @param {string} [props.description] - The field description.
 * @returns {JSX.Element} - The readonly date input component.
 */
export const ReadonlyDateInputTemplate: React.FC<{
  title?: string
  value?: Date
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
        {value?.toLocaleDateString() ?? 'N/A'}
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
 * Helper function to format Date to YYYY-MM-DD for HTML date input
 * @param date - Date to format
 * @returns Formatted date string
 */
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * DateInputTemplate
 * Renders a date input field for Date schemas using Zod.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the date field.
 * @param {string[]} props.path - The path to the date field in the form data.
 * @returns {JSX.Element} - The date input field component.
 */
export const DateInputTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  if (readonly) {
    return (
      <ReadonlyDateInputTemplate
        title={metadata.title}
        value={valueAtPath as Date}
        description={metadata.description}
      />
    )
  }

  /**
   * Handles date input value changes
   * @param event - The input change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === '') {
      setValueAtPath(null)
    } else {
      const dateValue = new Date(value)
      setValueAtPath(isNaN(dateValue.getTime()) ? null : dateValue)
    }
  }

  // Convert Date to string for display
  const displayValue =
    valueAtPath instanceof Date ? formatDateForInput(valueAtPath) : ''

  return (
    <div className="flex w-full flex-col space-y-2">
      {metadata.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {metadata.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        type="date"
        value={displayValue}
        disabled={false} // Zod doesn't have readOnly property like JSON Schema
        onChange={handleChange}
        placeholder={metadata.title || ''}
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:hover:border-gray-500 dark:focus:border-blue-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400'
            : ''
        } `}
      />

      {metadata.description && (
        <small className="text-xs text-gray-500 dark:text-gray-400">
          {metadata.description}
        </small>
      )}

      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div
            key={index}
            className="text-sm font-medium text-red-500 dark:text-red-400"
          >
            {error.message}
          </div>
        ))}
    </div>
  )
}
