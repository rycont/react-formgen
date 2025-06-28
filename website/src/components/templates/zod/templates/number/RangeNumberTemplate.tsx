import React from 'react'
import type * as z from 'zod/v4/core'
import {
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
} from '@react-formgen/zod'
import { getMetadata, isRequired, unwrapSchema } from '@react-formgen/zod'

/**
 * ReadonlyRangeTemplate
 * Renders a readonly range display for form preview mode.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The field title/label.
 * @param {number} [props.value] - The current value.
 * @param {number} [props.min] - The minimum value.
 * @param {number} [props.max] - The maximum value.
 * @param {string} [props.description] - The field description.
 * @returns {JSX.Element} - The readonly range component.
 */
export const ReadonlyRangeTemplate: React.FC<{
  title?: string
  value?: number
  min?: number
  max?: number
  description?: string
}> = ({ title, value, min = 0, max = 100, description }) => {
  const percentage = (((value ?? min) - min) / (max - min)) * 100

  return (
    <div className="flex w-full flex-col space-y-2">
      {title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </label>
      )}

      <div className="relative">
        {/* Range track */}
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-blue-500 transition-all duration-200 dark:bg-blue-400"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Value display */}
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{min}</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {value ?? 'N/A'}
          </span>
          <span>{max}</span>
        </div>
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
 * Helper function to extract min/max/step constraints from Zod number schema
 * @param schema - The Zod schema to analyze
 * @returns Object with min, max, and step values
 */
function extractNumberConstraints(schema: z.$ZodType): {
  min?: number
  max?: number
  step?: number
} {
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodNumber
  const bag = unwrappedSchema._zod.bag

  return {
    min: bag?.minimum,
    max: bag?.maximum,
  }
}

/**
 * RangeNumberTemplate
 * Renders a range slider input for number schemas with min/max constraints.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the range field.
 * @param {string[]} props.path - The path to the range field in the form data.
 * @returns {JSX.Element} - The range slider component.
 */
export const RangeNumberTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  // Extract min/max/step from Zod checks
  const { min = 0, max = 100 } = extractNumberConstraints(schema)

  // Ensure we have a valid number value
  const currentValue = typeof valueAtPath === 'number' ? valueAtPath : min

  if (readonly) {
    return (
      <ReadonlyRangeTemplate
        title={metadata.title}
        value={currentValue}
        min={min}
        max={max}
        description={metadata.description}
      />
    )
  }

  /**
   * Handles range value changes
   * @param event - The range input change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)
    setValueAtPath(newValue)
  }

  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div className="flex w-full flex-col space-y-3">
      {metadata.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {metadata.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="space-y-2">
        {/* Range Input */}
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={1} // Zod doesn't have a built-in way to handle a step value. Perhaps this can be addressed wtih teh uiSchema?
            value={currentValue}
            disabled={false} // Zod doesn't have readOnly property like JSON Schema
            onChange={handleChange}
            className={`/* Webkit styles */ /* Firefox styles */ h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:dark:bg-blue-400 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:bg-blue-600 [&::-webkit-slider-thumb]:dark:border-gray-800 [&::-webkit-slider-thumb]:dark:bg-blue-400 [&::-webkit-slider-thumb]:dark:hover:bg-blue-300 ${
              errorsAtPath && errorsAtPath.length > 0
                ? '[&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:dark:bg-red-400 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:dark:bg-red-400'
                : ''
            } `}
            style={{
              background: `linear-gradient(to right, 
                rgb(59 130 246) 0%, 
                rgb(59 130 246) ${percentage}%, 
                rgb(229 231 235) ${percentage}%, 
                rgb(229 231 235) 100%)`,
            }}
          />
        </div>

        {/* Value display and range labels */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {min}
          </span>

          <div
            className={`rounded-md px-3 py-1 text-sm font-medium ${
              errorsAtPath && errorsAtPath.length > 0
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
            } `}
          >
            {currentValue}
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {max}
          </span>
        </div>
      </div>

      {metadata.description && (
        <small className="text-xs text-gray-500 dark:text-gray-400">
          {metadata.description}
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
