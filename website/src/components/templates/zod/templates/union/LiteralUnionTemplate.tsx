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
 * Helper function to extract literal options from union schema
 * @param schema - The union schema to analyze
 * @returns Array of literal options with value and label
 */
function extractLiteralOptions(
  schema: z.$ZodType,
): Array<{ value: unknown; label: string }> {
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodUnion
  const options: Array<{ value: unknown; label: string }> = []

  unwrappedSchema._zod.def.options.forEach((option: z.$ZodType) => {
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
 * LiteralUnionTemplate
 * Renders radio buttons for unions with literal values.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the union field.
 * @param {string[]} props.path - The path to the union field in the form data.
 * @returns {JSX.Element} - The literal union template component.
 */
export const LiteralUnionTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  const options = extractLiteralOptions(schema)

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

  return (
    <div className="flex w-full flex-col space-y-3">
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

      <div
        className={`space-y-1 rounded-lg border p-3 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-200 bg-red-50/50 dark:border-red-700 dark:bg-red-900/10'
            : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50'
        } `}
      >
        {options.map((option) => (
          <label
            key={String(option.value)}
            className={`flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 ${
              valueAtPath === option.value
                ? 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                : 'border border-transparent'
            } `}
          >
            <input
              type="radio"
              checked={valueAtPath === option.value}
              onChange={() => setValueAtPath(option.value)}
              className="h-4 w-4 border-gray-300 text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-blue-400"
            />
            <span
              className={`text-sm font-medium ${
                valueAtPath === option.value
                  ? 'text-blue-900 dark:text-blue-100'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>

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
