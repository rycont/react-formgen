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
 * Helper function to extract options from array element union schema
 * @param elementSchema - The element schema to analyze
 * @returns Array of options with value and label
 */
function extractUnionOptions(
  elementSchema: z.$ZodType,
): Array<{ value: unknown; label: string }> {
  const unwrappedElement = unwrapSchema(elementSchema)

  if (unwrappedElement._zod.def.type !== 'union') {
    return []
  }

  const unionSchema = unwrappedElement as z.$ZodUnion
  const options: Array<{ value: unknown; label: string }> = []

  unionSchema._zod.def.options.forEach((option: z.$ZodType) => {
    const unwrappedOption = unwrapSchema(option)

    if (unwrappedOption._zod.def.type === 'literal') {
      const literalSchema = unwrappedOption as z.$ZodLiteral
      const values = Array.from(literalSchema._zod.def.values)
      const metadata = getMetadata(option)

      options.push({
        value: values[0],
        label: metadata?.title || String(values[0]),
      })
    }
  })

  return options
}

/**
 * MultiSelectTemplate
 * Renders a multi-select dropdown for arrays with union literal elements.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The multi-select field component.
 */
export const MultiSelectTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, [])
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  // Extract array element schema and options
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodArray
  const elementSchema = unwrappedSchema._zod.def.element
  const options = extractUnionOptions(elementSchema)

  /**
   * Handles multi-select changes
   * @param event - The select change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => {
        // Try to parse the value back to its original type
        const originalOption = options.find(
          (opt) => String(opt.value) === option.value,
        )
        return originalOption ? originalOption.value : option.value
      },
    )
    setValueAtPath(selectedOptions)
  }

  if (readonly) {
    const selectedLabels = options
      .filter(
        (option) =>
          Array.isArray(valueAtPath) && valueAtPath.includes(option.value),
      )
      .map((option) => option.label)
      .join(', ')

    return (
      <div className="flex w-full flex-col space-y-1">
        {metadata.title && (
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {metadata.title}
          </label>
        )}
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
          {selectedLabels || 'N/A'}
        </div>
        {metadata.description && (
          <small className="text-xs text-gray-500 dark:text-gray-400">
            {metadata.description}
          </small>
        )}
      </div>
    )
  }

  // Convert current values to strings for HTML select
  const currentValues = Array.isArray(valueAtPath)
    ? valueAtPath.map((val) => String(val))
    : []

  return (
    <div className="flex w-full flex-col space-y-2">
      {metadata.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {metadata.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {metadata.description && (
        <small className="-mt-1 text-xs text-gray-500 dark:text-gray-400">
          {metadata.description}
        </small>
      )}

      <div className="relative">
        <select
          multiple
          value={currentValues}
          onChange={handleChange}
          disabled={false} // Zod doesn't have readOnly property like JSON Schema
          size={Math.min(options.length, 6)} // Show up to 6 options without scrolling
          className={`min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:focus:border-blue-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${
            errorsAtPath && errorsAtPath.length > 0
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400'
              : ''
          } `}
        >
          {options.map((option) => (
            <option
              key={String(option.value)}
              value={String(option.value)}
              className="px-2 py-1"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <small className="text-xs text-gray-500 dark:text-gray-400">
        Hold Ctrl (Cmd on Mac) to select multiple options
      </small>

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
