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
 * MultiSelectCheckboxTemplate
 * Renders a set of checkboxes for multi-select arrays with unique items.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The multi-select checkbox component.
 */
export const MultiSelectCheckboxTemplate: React.FC<{
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value
    const updatedValues = valueAtPath.includes(selectedValue)
      ? valueAtPath.filter((item: string) => item !== selectedValue)
      : [...valueAtPath, selectedValue]
    setValueAtPath(updatedValues)
  }

  return (
    <div className="flex w-full flex-col space-y-3">
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

      <div
        className={`space-y-1 rounded-lg border p-3 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-200 bg-red-50/50 dark:border-red-700 dark:bg-red-900/10'
            : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50'
        } `}
      >
        {options
          .filter(
            (option) =>
              option.value !== undefined && option.label !== undefined,
          )
          .map((option) => (
            <label
              key={String(option.value)}
              className={`flex cursor-pointer items-center space-x-3 rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 ${readonly ? 'cursor-not-allowed opacity-50' : ''} ${
                valueAtPath.includes(option.value)
                  ? 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                  : 'border border-transparent'
              } `}
            >
              <input
                type="checkbox"
                value={String(option.value)}
                checked={valueAtPath.includes(option.value)}
                onChange={handleChange}
                disabled={readonly}
                className={`h-4 w-4 rounded border-gray-300 bg-white text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400`}
              />
              <span
                className={`text-sm font-medium ${
                  valueAtPath.includes(option.value)
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-gray-100'
                } ${readonly ? 'text-gray-500 dark:text-gray-400' : ''} `}
              >
                {String(option.label)}
              </span>
            </label>
          ))}
      </div>

      {/* Selected items summary */}
      {valueAtPath && valueAtPath.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {valueAtPath.length} item{valueAtPath.length !== 1 ? 's' : ''}{' '}
          selected
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
