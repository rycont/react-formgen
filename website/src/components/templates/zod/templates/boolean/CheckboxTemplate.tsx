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
 * ReadonlyCheckboxTemplate
 * Renders a readonly checkbox display for form preview mode.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The field title/label.
 * @param {string | number | boolean} [props.value] - The current value.
 * @param {string} [props.description] - The field description.
 * @returns {JSX.Element} - The readonly checkbox component.
 */
export const ReadonlyCheckboxTemplate: React.FC<{
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
 * CheckboxTemplate
 * Renders a checkbox for boolean schemas without union options.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the checkbox boolean field.
 * @param {string[]} props.path - The path to the checkbox boolean field in the form data.
 * @returns {JSX.Element} - The checkbox boolean field component.
 */
export const CheckboxTemplate: React.FC<{
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
      <ReadonlyCheckboxTemplate
        title={metadata.title}
        value={valueAtPath}
        description={metadata.description}
      />
    )
  }

  return (
    <div className="flex w-full flex-col space-y-2">
      <div
        className={`flex items-center space-x-3 rounded-lg border p-3 transition-all duration-200 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-200 bg-red-50/50 dark:border-red-700 dark:bg-red-900/10'
            : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50'
        } hover:bg-gray-100/50 dark:hover:bg-gray-700/50`}
      >
        <input
          type="checkbox"
          checked={!!valueAtPath}
          disabled={false} // Zod doesn't have readOnly property like JSON Schema
          onChange={(event) => setValueAtPath(event.target.checked)}
          className={`h-4 w-4 rounded border-gray-300 bg-white text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400 ${
            errorsAtPath && errorsAtPath.length > 0
              ? 'border-red-500 dark:border-red-400'
              : ''
          } `}
        />
        {metadata.title && (
          <label
            className={`flex-1 cursor-pointer text-sm font-medium ${
              valueAtPath
                ? 'text-blue-900 dark:text-blue-100'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {metadata.title}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
      </div>

      {metadata.description && (
        <small className="ml-1 text-xs text-gray-500 dark:text-gray-400">
          {metadata.description}
        </small>
      )}

      {errorsAtPath &&
        errorsAtPath.map((error, index) => (
          <div
            key={index}
            className="ml-1 text-sm font-medium text-red-500 dark:text-red-400"
          >
            {error.message}
          </div>
        ))}
    </div>
  )
}
