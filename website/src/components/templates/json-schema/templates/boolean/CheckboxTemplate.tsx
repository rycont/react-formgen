import React from 'react'
import {
  BooleanSchema,
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
  useIsRequired,
} from '@react-formgen/json-schema'

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
 * CheckboxTemplate
 * Renders a checkbox for boolean schemas without oneOf options.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the checkbox boolean field.
 * @param {string[]} props.path - The path to the checkbox boolean field in the form data.
 * @returns {JSX.Element} - The checkbox boolean field component.
 */
export const CheckboxTemplate: React.FC<{
  schema: BooleanSchema
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = useIsRequired(path)

  if (readonly) {
    return (
      <ReadonlyCheckboxTemplate
        title={schema.title}
        value={valueAtPath ? 'true' : 'false'}
        description={schema.description}
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
        } ${!schema.readOnly ? 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50' : ''} `}
      >
        <input
          type="checkbox"
          checked={valueAtPath}
          disabled={schema.readOnly}
          onChange={(event) => setValueAtPath(event.target.checked)}
          className={`h-4 w-4 rounded border-gray-300 bg-white text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400 ${
            errorsAtPath && errorsAtPath.length > 0
              ? 'border-red-500 dark:border-red-400'
              : ''
          } `}
        />
        {schema.title && (
          <label
            className={`flex-1 cursor-pointer text-sm font-medium ${
              valueAtPath
                ? 'text-blue-900 dark:text-blue-100'
                : 'text-gray-900 dark:text-gray-100'
            } ${schema.readOnly ? 'cursor-not-allowed text-gray-500 dark:text-gray-400' : ''} `}
          >
            {schema.title}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
      </div>

      {schema.description && (
        <small className="ml-1 text-xs text-gray-500 dark:text-gray-400">
          {schema.description}
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
