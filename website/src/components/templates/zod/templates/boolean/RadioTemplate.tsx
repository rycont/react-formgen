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
 * ReadonlyRadioTemplate
 * Renders a readonly radio display for form preview mode.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The field title/label.
 * @param {string | number | boolean} [props.value] - The current value.
 * @param {string} [props.description] - The field description.
 * @returns {JSX.Element} - The readonly radio component.
 */
export const ReadonlyRadioTemplate: React.FC<{
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
        {value ? 'true' : 'false'}
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
 * RadioTemplate
 * Renders radio buttons for boolean schemas when explicitly requested via uiSchema.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the radio boolean field.
 * @param {string[]} props.path - The path to the radio boolean field in the form data.
 * @returns {JSX.Element} - The radio boolean field component.
 */
export const RadioTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  // Standard boolean options
  const options = [
    { const: true, title: 'True' },
    { const: false, title: 'False' },
  ]

  if (readonly) {
    return (
      <ReadonlyRadioTemplate
        title={metadata.title}
        value={valueAtPath}
        description={metadata.description}
      />
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

      <div
        className={`space-y-1 rounded-lg border p-3 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-200 bg-red-50/50 dark:border-red-700 dark:bg-red-900/10'
            : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50'
        } `}
      >
        {options.map((option) => (
          <label
            key={option.title}
            className={`flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 ${
              valueAtPath === option.const
                ? 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                : 'border border-transparent'
            } `}
          >
            <input
              type="radio"
              checked={valueAtPath === option.const}
              disabled={false} // Zod doesn't have readOnly property like JSON Schema
              onChange={() => setValueAtPath(option.const)}
              className="h-4 w-4 border-gray-300 text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-blue-400"
            />
            <span
              className={`text-sm font-medium ${
                valueAtPath === option.const
                  ? 'text-blue-900 dark:text-blue-100'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {option.title}
            </span>
          </label>
        ))}
      </div>

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
