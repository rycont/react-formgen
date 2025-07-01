import React from 'react'
import {
  ArraySchema,
  FormgenJSONSchema7,
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
  useIsRequired,
} from '@react-formgen/json-schema'

/**
 * MultiSelectTemplate
 * Renders a multi-select dropdown for arrays with unique items.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The multi-select field component.
 */
export const MultiSelectTemplate: React.FC<{
  schema: ArraySchema
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, [])
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = useIsRequired(path)

  const options = React.useMemo(() => {
    if (typeof schema.items === 'object' && !Array.isArray(schema.items)) {
      if ('enum' in schema.items && schema.items.enum) {
        return schema.items.enum.map((option) => ({
          value: option,
          label: option,
        }))
      } else if ('oneOf' in schema.items && schema.items.oneOf) {
        return schema.items.oneOf
          .filter(
            (item): item is FormgenJSONSchema7 =>
              typeof item === 'object' && !Array.isArray(item),
          )
          .map((option) => ({
            value: option.const,
            label: option.title,
          }))
      }
    }
    return []
  }, [schema])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    )
    setValueAtPath(selectedOptions)
  }

  return (
    <div className="flex w-full flex-col space-y-2">
      {schema.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {schema.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {schema.description && (
        <small className="-mt-1 text-xs text-gray-500 dark:text-gray-400">
          {schema.description}
        </small>
      )}

      <div className="relative">
        <select
          multiple
          value={valueAtPath}
          onChange={handleChange}
          disabled={readonly}
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
              className="selected:bg-blue-100 dark:selected:bg-blue-900/50 selected:text-blue-900 dark:selected:text-blue-100 px-2 py-1 text-gray-900 hover:bg-blue-50 dark:text-gray-100 dark:hover:bg-blue-900/30"
            >
              {String(option.label)}
            </option>
          ))}
        </select>

        {/* Helper text for multi-select usage */}
        <div className="absolute -bottom-5 left-0 text-xs text-gray-400 dark:text-gray-500">
          Hold Ctrl/Cmd to select multiple items
        </div>
      </div>

      {/* Selected items indicator */}
      {valueAtPath && valueAtPath.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          <span className="mr-2 text-xs text-gray-500 dark:text-gray-400">
            Selected ({valueAtPath.length}):
          </span>
          {valueAtPath.map(
            (value: string | number | boolean, index: number) => {
              const option = options.find(
                (opt) => String(opt.value) === String(value),
              )
              return (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                >
                  {option ? String(option.label) : String(value)}
                </span>
              )
            },
          )}
        </div>
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
