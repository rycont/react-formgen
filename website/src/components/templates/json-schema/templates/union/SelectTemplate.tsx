import React from 'react'
import {
  StringSchema,
  NumberSchema,
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
  useIsRequired,
} from '@react-formgen/json-schema'

export const ReadonlySelectTemplate: React.FC<{
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
 * SelectTemplate
 * Renders a select dropdown field for string or number schemas with enum or oneOf options.
 * @param {StringSchema|NumberSchema} props.schema - The schema for the select field.
 * @param {string[]} props.path - The path to the select field in the form data.
 * @returns {JSX.Element} - The select field component.
 */
export const SelectTemplate: React.FC<{
  schema: StringSchema | NumberSchema
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, '')
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = useIsRequired(path)

  if (readonly) {
    const selectedOption =
      schema.enum?.find((opt) => opt === valueAtPath) ||
      schema.oneOf?.find((opt) => opt.const === valueAtPath)?.title ||
      valueAtPath ||
      'N/A' // Default to 'N/A' if no match found. This is just a workaround for the example to ensure we always have a value to display. Probably not the best idea to push this to prod :)

    return (
      <ReadonlySelectTemplate
        title={schema.title ?? undefined}
        value={selectedOption}
        description={schema.description ?? undefined}
      />
    )
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

      <select
        value={valueAtPath}
        disabled={schema.readOnly}
        onChange={handleChange}
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:focus:border-blue-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400'
            : ''
        } `}
      >
        <option value="" className="text-gray-500 dark:text-gray-400">
          -- Select an option --
        </option>
        {schema.enum
          ? schema.enum.map((option, index) => (
              <option
                key={index}
                value={option}
                className="text-gray-900 dark:text-gray-100"
              >
                {option}
              </option>
            ))
          : schema.oneOf?.map((option) => (
              <option
                key={option.const}
                value={option.const}
                className="text-gray-900 dark:text-gray-100"
              >
                {option.title}
              </option>
            ))}
      </select>

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
