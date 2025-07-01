import React from 'react'
import type * as z from 'zod/v4/core'
import {
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  useRenderTemplate,
  FormState,
} from '@react-formgen/zod'
import {
  getMetadata,
  isRequired,
  unwrapSchema,
  generateInitialData,
} from '@react-formgen/zod'

/**
 * ComplexUnionTemplate
 * Renders a discriminated union by trying to match the current value against each option.
 * Falls back to rendering the first option if no match is found.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the union field.
 * @param {string[]} props.path - The path to the union field in the form data.
 * @returns {JSX.Element} - The complex union template component.
 */
export const ComplexUnionTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const RenderTemplate = useRenderTemplate()
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  // Extract union options
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodUnion
  const options = unwrappedSchema._zod.def.options

  // Try to find which option matches the current value
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0)

  // When value changes, try to determine which schema option it matches
  React.useEffect(() => {
    if (valueAtPath !== undefined && valueAtPath !== null) {
      for (let i = 0; i < options.length; i++) {
        try {
          const result = (options[i] as z.$ZodType).safeParse(valueAtPath)
          if (result.success) {
            setSelectedOptionIndex(i)
            break
          }
        } catch {
          // Continue to next option
        }
      }
    }
  }, [valueAtPath, options])

  /**
   * Handles option change and updates the value accordingly
   * @param optionIndex - The index of the selected option
   */
  const handleOptionChange = (optionIndex: number) => {
    setSelectedOptionIndex(optionIndex)
    // Generate initial data for the new option
    const newValue = generateInitialData(options[optionIndex] as z.$ZodType)
    setValueAtPath(newValue)
  }

  if (readonly) {
    return (
      <div className="mb-4 w-full border-l-2 border-gray-300 pl-4 dark:border-gray-600">
        {metadata.title && (
          <strong className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">
            {metadata.title}
          </strong>
        )}
        {metadata.description && (
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            {metadata.description}
          </p>
        )}
        <div className="mt-2">
          <RenderTemplate
            schema={options[selectedOptionIndex] as z.$ZodType}
            path={path}
          />
        </div>
      </div>
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

      {metadata.description && (
        <small className="-mt-1 text-xs text-gray-500 dark:text-gray-400">
          {metadata.description}
        </small>
      )}

      {/* Option selector */}
      {options.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {options.map((_, index) => {
            const optionMetadata = getMetadata(options[index] as z.$ZodType)
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionChange(index)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedOptionIndex === index
                    ? 'border-blue-500 bg-blue-100 text-blue-800 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700'
                }`}
              >
                {optionMetadata?.title || `Option ${index + 1}`}
              </button>
            )
          })}
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

      {/* Render the selected option */}
      <div
        className={`rounded-lg border-2 p-4 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-200 bg-red-50/30 dark:border-red-700 dark:bg-red-900/10'
            : 'border-gray-200 bg-gray-50/30 dark:border-gray-700 dark:bg-gray-800/30'
        }`}
      >
        <RenderTemplate
          schema={options[selectedOptionIndex] as z.$ZodType}
          path={path}
        />
      </div>
    </div>
  )
}
