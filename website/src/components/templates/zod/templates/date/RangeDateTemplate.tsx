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
 * ReadonlyRangeDateTemplate
 * Renders a readonly date range display for form preview mode.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The field title/label.
 * @param {Date} [props.value] - The current value.
 * @param {Date} [props.min] - The minimum value.
 * @param {Date} [props.max] - The maximum value.
 * @param {string} [props.description] - The field description.
 * @returns {JSX.Element} - The readonly range component.
 */
export const ReadonlyRangeDateTemplate: React.FC<{
  title?: string
  value?: Date
  min?: Date
  max?: Date
  description?: string
}> = ({ title, value, min, max, description }) => {
  const percentage =
    min && max && value
      ? ((value.getTime() - min.getTime()) / (max.getTime() - min.getTime())) *
        100
      : 0

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
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>

        {/* Value display */}
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{min?.toLocaleDateString() ?? 'N/A'}</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {value?.toLocaleDateString() ?? 'N/A'}
          </span>
          <span>{max?.toLocaleDateString() ?? 'N/A'}</span>
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
 * Helper function to extract min/max constraints from Zod Date schema
 * @param schema - The Zod schema to analyze
 * @returns Object with min and max Date values
 */
function extractDateConstraints(schema: z.$ZodType): {
  min?: Date
  max?: Date
} {
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodDate
  const bag = unwrappedSchema._zod.bag

  return {
    min: bag?.minimum,
    max: bag?.maximum,
  }
}

/**
 * Helper function to format Date to YYYY-MM-DD for HTML date input
 * @param date - Date to format
 * @returns Formatted date string
 */
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * RangeDateTemplate
 * Renders a date range slider input for Date schemas with min/max constraints.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the date range field.
 * @param {string[]} props.path - The path to the date range field in the form data.
 * @returns {JSX.Element} - The date range slider component.
 */
export const RangeDateTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  // Extract min/max from Zod checks
  const { min, max } = extractDateConstraints(schema)

  // Ensure we have a valid Date value
  const currentValue =
    valueAtPath instanceof Date ? valueAtPath : min || new Date()

  if (readonly) {
    return (
      <ReadonlyRangeDateTemplate
        title={metadata.title}
        value={currentValue}
        min={min}
        max={max}
        description={metadata.description}
      />
    )
  }

  /**
   * Handles date range value changes
   * @param event - The range input change event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = new Date(event.target.value)
    if (!isNaN(dateValue.getTime())) {
      setValueAtPath(dateValue)
    }
  }

  // Calculate percentage for visual indicator
  const percentage =
    min && max
      ? ((currentValue.getTime() - min.getTime()) /
          (max.getTime() - min.getTime())) *
        100
      : 0

  return (
    <div className="flex w-full flex-col space-y-3">
      {metadata.title && (
        <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {metadata.title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="space-y-2">
        {/* Date Range Input */}
        <div className="relative">
          <input
            type="date"
            value={formatDateForInput(currentValue)}
            min={min ? formatDateForInput(min) : undefined}
            max={max ? formatDateForInput(max) : undefined}
            disabled={false} // Zod doesn't have readOnly property like JSON Schema
            onChange={handleChange}
            className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:hover:border-gray-500 dark:focus:border-blue-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 ${
              errorsAtPath && errorsAtPath.length > 0
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400'
                : ''
            } `}
          />
        </div>

        {/* Visual range indicator */}
        {min && max && (
          <div className="relative">
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full transition-all duration-200 ${
                  errorsAtPath && errorsAtPath.length > 0
                    ? 'bg-red-500 dark:bg-red-400'
                    : 'bg-blue-500 dark:bg-blue-400'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
              />
            </div>

            {/* Range labels */}
            <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{min.toLocaleDateString()}</span>
              <div
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  errorsAtPath && errorsAtPath.length > 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                } `}
              >
                {currentValue.toLocaleDateString()}
              </div>
              <span>{max.toLocaleDateString()}</span>
            </div>
          </div>
        )}
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
