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
 * ReadonlyTextareaTemplate
 * Renders a readonly textarea display for form preview mode.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The field title/label.
 * @param {string | number | boolean} [props.value] - The current value.
 * @param {string} [props.description] - The field description.
 * @returns {JSX.Element} - The readonly textarea component.
 */
export const ReadonlyTextareaTemplate: React.FC<{
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
      <div className="min-h-[80px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 whitespace-pre-wrap text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
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
 * TextareaTemplate
 * Renders a textarea input for multi-line string input using Zod schemas.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the textarea field.
 * @param {string[]} props.path - The path to the textarea field in the form data.
 * @returns {JSX.Element} - The textarea field component.
 */
export const TextareaTemplate: React.FC<{
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
      <ReadonlyTextareaTemplate
        title={metadata.title}
        value={valueAtPath}
        description={metadata.description}
      />
    )
  }

  /**
   * Handles textarea value changes
   * @param event - The textarea change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueAtPath(event.target.value)
  }

  return (
    <div className="flex w-full flex-col space-y-2">
      {metadata.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {metadata.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <textarea
        value={valueAtPath ?? ''}
        onChange={handleChange}
        rows={4}
        className={`min-h-[80px] resize-y rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-offset-gray-900 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-500 focus:ring-red-500 dark:border-red-400'
            : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
        } `
          .replace(/\s+/g, ' ')
          .trim()}
        placeholder={metadata.description || 'Enter text...'}
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
