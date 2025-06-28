import React from 'react'
import type * as z from 'zod/v4/core'
import {
  useFormContext,
  useArrayTemplate,
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
 * ReadonlySimpleArrayTemplate
 * Renders a readonly array display for form preview mode.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The field title/label.
 * @param {string} [props.description] - The field description.
 * @param {React.ReactNode} props.children - Child elements to render.
 * @returns {JSX.Element} - The readonly array component.
 */
export const ReadonlySimpleArrayTemplate: React.FC<{
  title?: string
  description?: string
  children: React.ReactNode
}> = ({ title, description, children }) => {
  return (
    <div className="mb-4 w-full border-l-2 border-gray-300 pl-4 dark:border-gray-600">
      {title && (
        <strong className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </strong>
      )}
      {description && (
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  )
}

/**
 * SimpleArrayTemplate
 * Renders an array schema where items are of the same type.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema of the array.
 * @param {string[]} props.path - The path to the array in the form data.
 * @returns {JSX.Element} - The simple array template component.
 */
export const SimpleArrayTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const readonly = useFormContext((state: FormState) => state.readonly)
  const RenderTemplate = useRenderTemplate()
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  // Extract array element schema
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodArray
  const elementSchema = unwrappedSchema._zod.def.element

  const { valueAtPath, errorsAtPath, moveItem, removeItem, addItem } =
    useArrayTemplate(path, () => generateInitialData(elementSchema), [])

  if (readonly) {
    return (
      <ReadonlySimpleArrayTemplate
        title={metadata.title}
        description={metadata.description}
      >
        {Array.isArray(valueAtPath) && valueAtPath.length > 0 ? (
          valueAtPath.map((_, index) => (
            <RenderTemplate
              key={index}
              schema={elementSchema}
              path={[...path, index.toString()]}
            />
          ))
        ) : (
          <div className="text-gray-500 italic dark:text-gray-400">
            No items
          </div>
        )}
      </ReadonlySimpleArrayTemplate>
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

      <div className="space-y-3">
        {errorsAtPath &&
          errorsAtPath.map((error, index) => (
            <div
              key={index}
              className="text-sm font-medium text-red-500 dark:text-red-400"
            >
              {error.message}
            </div>
          ))}

        <div
          className={`space-y-4 rounded-lg border-2 p-4 ${
            errorsAtPath && errorsAtPath.length > 0
              ? 'border-red-200 bg-red-50/30 dark:border-red-700 dark:bg-red-900/10'
              : 'border-gray-200 bg-gray-50/30 dark:border-gray-700 dark:bg-gray-800/30'
          } `}
        >
          {Array.isArray(valueAtPath) && valueAtPath.length > 0 ? (
            valueAtPath.map((_, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-gray-800"
              >
                <div className="flex-1">
                  <RenderTemplate
                    schema={elementSchema}
                    path={[...path, index.toString()]}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === valueAtPath.length - 1}
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500 italic dark:text-gray-400">
              No items added yet
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="w-full rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-all duration-200 ease-in-out hover:border-green-400 hover:bg-green-100 focus:ring-2 focus:ring-green-500/20 focus:outline-none dark:border-green-600 dark:bg-green-900/30 dark:text-green-300 dark:hover:border-green-500 dark:hover:bg-green-900/50"
        >
          + Add Item
        </button>
      </div>
    </div>
  )
}
