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
 * SimpleTupleTemplate
 * Renders a tuple where each item has a specific schema at each position.
 * @param {Object} props - The props for the component.
 * @param {z.$ZodType} props.schema - The Zod schema for the tuple.
 * @param {string[]} props.path - The path to the tuple in the form data.
 * @returns {JSX.Element} - The tuple template component.
 */
export const SimpleTupleTemplate: React.FC<{
  schema: z.$ZodType
  path: string[]
}> = ({ schema, path }) => {
  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const RenderTemplate = useRenderTemplate()
  const required = isRequired(schema)
  const metadata = getMetadata(schema)

  // Extract tuple items
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodTuple
  const items = unwrappedSchema._zod.def.items

  // For optional tuples that are undefined
  if (!required && valueAtPath === undefined && !readonly) {
    return (
      <div className="flex w-full flex-col space-y-2">
        {metadata.title && (
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {metadata.title}
            <span className="ml-1 text-gray-500 dark:text-gray-400">
              (optional)
            </span>
          </label>
        )}
        {metadata.description && (
          <small className="text-xs text-gray-500 dark:text-gray-400">
            {metadata.description}
          </small>
        )}
        <button
          type="button"
          onClick={() => {
            // Initialize the tuple with default values for each item
            const initialTuple = items.map((item: z.$ZodType) =>
              generateInitialData(item),
            )
            setValueAtPath(initialTuple)
          }}
          className="w-full rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-all duration-200 ease-in-out hover:border-green-400 hover:bg-green-100 focus:ring-2 focus:ring-green-500/20 focus:outline-none dark:border-green-600 dark:bg-green-900/30 dark:text-green-300 dark:hover:border-green-500 dark:hover:bg-green-900/50"
        >
          + Add {metadata.title || 'Tuple'}
        </button>
      </div>
    )
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
        <div className="mt-2 space-y-3">
          {valueAtPath !== undefined ? (
            items.map((itemSchema: z.$ZodType, index: number) => (
              <div key={index} className="space-y-1">
                {/* <div className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  Item {index + 1}
                </div> */}
                <RenderTemplate
                  schema={itemSchema}
                  path={[...path, index.toString()]}
                />
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic dark:text-gray-400">
              Not set
            </div>
          )}
        </div>
      </div>
    )
  }

  const shouldRenderItems = required || valueAtPath !== undefined

  return (
    <div className="flex w-full flex-col space-y-3">
      <div className="flex items-center justify-between">
        {metadata.title && (
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {metadata.title}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        {!required && valueAtPath !== undefined && (
          <button
            type="button"
            onClick={() => setValueAtPath(undefined)}
            className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
          >
            Remove
          </button>
        )}
      </div>

      {metadata.description && (
        <small className="-mt-1 text-xs text-gray-500 dark:text-gray-400">
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

      {shouldRenderItems && (
        <div
          className={`space-y-4 rounded-lg border-2 p-4 ${
            errorsAtPath && errorsAtPath.length > 0
              ? 'border-red-200 bg-red-50/30 dark:border-red-700 dark:bg-red-900/10'
              : 'border-gray-200 bg-gray-50/30 dark:border-gray-700 dark:bg-gray-800/30'
          } `}
        >
          <div
            className={`grid gap-4 ${(() => {
              // You can add uiSchema support for columns later
              // For now, default to 1 column for tuple layouts
              return 'grid-cols-1'
            })()}`}
          >
            {items.map((itemSchema: z.$ZodType, index: number) => (
              <div key={index} className="space-y-2">
                {/* <div className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  Item {index + 1}
                </div> */}
                <RenderTemplate
                  schema={itemSchema}
                  path={[...path, index.toString()]}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If the tuple is optional and not required, render a button to remove it */}
      {!readonly &&
        !required &&
        valueAtPath !== undefined &&
        items.length > 0 && (
          <button
            type="button"
            onClick={() => setValueAtPath(undefined)}
            className="w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-all duration-200 ease-in-out hover:border-red-400 hover:bg-red-100 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-900/50"
          >
            Remove {metadata.title || 'Tuple'}
          </button>
        )}
    </div>
  )
}
