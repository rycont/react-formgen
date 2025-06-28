import React from 'react'
import type * as z from 'zod/v4/core'
import {
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
} from '@react-formgen/zod'
import { getMetadata, isRequired, unwrapSchema } from '@react-formgen/zod'

/**
 * Helper function to extract enum options
 * @param schema - The enum schema to analyze
 * @returns Array of enum options with value and label
 */
function extractEnumOptions(
  schema: z.$ZodType,
): Array<{ value: string; label: string }> {
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodEnum
  const entries = unwrappedSchema._zod.def.entries

  return Object.entries(entries).map(([key, val]) => ({
    value: val as string,
    label: key,
  }))
}

/**
 * SelectEnumTemplate
 * Renders a select dropdown for enum schemas.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the enum field.
 * @param {string[]} props.path - The path to the enum field in the form data.
 * @returns {JSX.Element} - The select enum template component.
 */
export const SelectEnumTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  const options = extractEnumOptions(schema)

  if (readonly) {
    const selectedOption = options.find((opt) => opt.value === valueAtPath)
    return (
      <div className="flex w-full flex-col space-y-1">
        {metadata.title && (
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {metadata.title}
          </label>
        )}
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
          {selectedOption?.label || 'N/A'}
        </div>
        {metadata.description && (
          <small className="text-xs text-gray-500 dark:text-gray-400">
            {metadata.description}
          </small>
        )}
      </div>
    )
  }

  /**
   * Handles select value changes
   * @param event - The select change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setValueAtPath(value === '' ? undefined : value)
  }

  return (
    <div className="flex w-full flex-col space-y-2">
      {metadata.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {metadata.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <select
        value={valueAtPath || ''}
        onChange={handleChange}
        disabled={false} // Zod doesn't have readOnly property like JSON Schema
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:hover:border-gray-500 dark:focus:border-blue-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400'
            : ''
        } `}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
