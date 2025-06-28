import React from 'react'
import {
  StringSchema,
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
  useIsRequired,
} from '@react-formgen/json-schema'

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
 * Renders a textarea input for multi-line string input.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the textarea field.
 * @param {string[]} props.path - The path to the textarea field in the form data.
 * @returns {JSX.Element} - The textarea field component.
 */
export const TextareaTemplate: React.FC<{
  schema: StringSchema
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = useIsRequired(path)

  if (readonly) {
    return (
      <ReadonlyTextareaTemplate
        title={schema.title ?? undefined}
        value={valueAtPath}
        description={schema.description ?? undefined}
      />
    )
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueAtPath(event.target.value)
  }

  return (
    <div className="flex w-full flex-col space-y-2">
      {schema.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {schema.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <textarea
        value={valueAtPath ?? ''}
        disabled={schema.readOnly}
        onChange={handleChange}
        placeholder={schema.title || ''}
        rows={4}
        className={`min-h-[80px] w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:hover:border-gray-500 dark:focus:border-blue-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400'
            : ''
        } `}
      />

      {schema.description && (
        <small className="text-xs text-gray-500 dark:text-gray-400">
          {schema.description}
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
