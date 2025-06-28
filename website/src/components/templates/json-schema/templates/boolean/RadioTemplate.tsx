import React from 'react'
import {
  BooleanSchema,
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
  useIsRequired,
} from '@react-formgen/json-schema'

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
 * RadioTemplate
 * Renders radio buttons for boolean schemas with oneOf options.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the radio boolean field.
 * @param {string[]} props.path - The path to the radio boolean field in the form data.
 * @returns {JSX.Element} - The radio boolean field component.
 */
export const RadioTemplate: React.FC<{
  schema: BooleanSchema
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = useIsRequired(path)

  if (readonly) {
    return (
      <ReadonlyRadioTemplate
        title={schema.title ?? undefined}
        value={valueAtPath ? 'true' : 'false'}
        description={schema.description ?? undefined}
      />
    )
  }

  return (
    <div className="flex w-full flex-col space-y-3">
      {schema.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {schema.title}
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
        {schema.oneOf?.map((option) => (
          <label
            key={option.title}
            className={`flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 ${schema.readOnly ? 'cursor-not-allowed opacity-50' : ''} ${valueAtPath === option.const ? 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' : 'border border-transparent'} `}
          >
            <input
              type="radio"
              checked={valueAtPath === option.const}
              disabled={schema.readOnly}
              onChange={() => setValueAtPath(option.const)}
              className={`h-4 w-4 border-gray-300 text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-blue-400`}
            />
            <span
              className={`text-sm font-medium ${
                valueAtPath === option.const
                  ? 'text-blue-900 dark:text-blue-100'
                  : 'text-gray-900 dark:text-gray-100'
              } ${schema.readOnly ? 'text-gray-500 dark:text-gray-400' : ''} `}
            >
              {option.title}
            </span>
          </label>
        ))}
      </div>

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
