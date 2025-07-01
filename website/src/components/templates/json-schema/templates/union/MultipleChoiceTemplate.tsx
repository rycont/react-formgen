import React from 'react'
import {
  StringSchema,
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
  useIsRequired,
} from '@react-formgen/json-schema'

export const ReadonlyMultipleChoiceOptionTemplate: React.FC<{
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
 * Memoized MultipleChoiceOptionTemplate to prevent re-renders unless its props change
 */
const MultipleChoiceOptionTemplate: React.FC<{
  value: string
  title: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}> = React.memo(({ value, title, checked, onChange, disabled }) => {
  return (
    <label
      className={`flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${checked ? 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' : 'border border-transparent'} `}
    >
      <input
        type="radio"
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 border-gray-300 text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-blue-400`}
      />
      <span
        className={`text-sm font-medium ${
          checked
            ? 'text-blue-900 dark:text-blue-100'
            : 'text-gray-900 dark:text-gray-100'
        } ${disabled ? 'text-gray-500 dark:text-gray-400' : ''} `}
      >
        {title}
      </span>
    </label>
  )
})

/**
 * MultipleChoiceTemplate
 * Renders a multiple-choice field as radio buttons for string schemas with enum or oneOf options.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the multiple-choice field.
 * @param {string[]} props.path - The path to the field in the form data.
 * @returns {JSX.Element} - The multiple-choice field component.
 */
export const MultipleChoiceTemplate: React.FC<{
  schema: StringSchema
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = useIsRequired(path)

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueAtPath(event.target.value)
    },
    [setValueAtPath],
  )

  // Memoize the options to prevent unnecessary recalculations
  const opts: { value: string; title: string }[] = React.useMemo(() => {
    const options: { value: string; title: string }[] = []
    if (schema.enum) {
      schema.enum.forEach((opt) => options.push({ value: opt, title: opt }))
    } else if (schema.oneOf) {
      schema.oneOf.forEach((opt) =>
        options.push({ value: opt.const, title: opt.title ?? opt.const }),
      )
    }
    return options
  }, [schema.enum, schema.oneOf])

  // Memoize the option rendering to avoid recreating the function on every render
  const renderOption = React.useCallback(
    (option: { value: string; title: string }, index: number) => {
      return (
        <MultipleChoiceOptionTemplate
          key={index}
          value={option.value}
          title={option.title}
          checked={valueAtPath === option.value}
          onChange={handleChange}
          disabled={schema.readOnly}
        />
      )
    },
    [valueAtPath, handleChange, schema.readOnly],
  )

  if (readonly) {
    const selectedOption =
      schema.enum?.find((opt) => opt === valueAtPath) ||
      schema.oneOf?.find((opt) => opt.const === valueAtPath)?.title ||
      valueAtPath
    return (
      <ReadonlyMultipleChoiceOptionTemplate
        title={schema.title ?? undefined}
        value={selectedOption}
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
        {opts.map((option, index) => renderOption(option, index))}
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
