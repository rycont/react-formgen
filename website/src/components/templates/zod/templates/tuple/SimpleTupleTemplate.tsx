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

  // Memoize metadata extraction to prevent re-calculation on every render
  const metadata = React.useMemo(() => getMetadata(schema), [schema])
  // Memoize columns calculation with proper Tailwind class mapping
  const gridColsClass = React.useMemo(() => {
    const cols = metadata.uiSchema?.props?.columns
    if (typeof cols === 'number' && cols > 0) {
      // Map to actual Tailwind classes to ensure they're included in build
      const gridClasses: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        7: 'grid-cols-7',
        8: 'grid-cols-8',
        9: 'grid-cols-9',
        10: 'grid-cols-10',
        11: 'grid-cols-11',
        12: 'grid-cols-12',
      }
      return gridClasses[Math.min(cols, 12)] || 'grid-cols-1'
    }
    return 'grid-cols-1'
  }, [metadata.uiSchema?.props?.columns])

  // Extract tuple items
  const unwrappedSchema = unwrapSchema(schema) as z.$ZodTuple
  const items = unwrappedSchema._zod.def.items

  return (
    <div className="flex w-full flex-col space-y-3">
      {valueAtPath ? (
        <>
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
              <div className={`grid gap-4 ${gridColsClass}`}>
                {items.map((itemSchema: z.$ZodType, index: number) => (
                  <div key={index} className="space-y-2">
                    <RenderTemplate
                      schema={itemSchema}
                      path={[...path, index.toString()]}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* If the tuple is not required, render a button to remove it */}
          {!readonly && !required && valueAtPath && (
            <button
              onClick={() => setValueAtPath(undefined)}
              type="button"
              className="w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-all duration-200 ease-in-out hover:border-red-400 hover:bg-red-100 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-900/50"
            >
              Remove {metadata.title ?? path[path.length - 1]}
            </button>
          )}
        </>
      ) : (
        !readonly && (
          <button
            onClick={() => {
              // Initialize the tuple with default values for each item
              const initialTuple = items.map((item: z.$ZodType) =>
                generateInitialData(item),
              )
              setValueAtPath(initialTuple)
            }}
            type="button"
            className="w-full rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-all duration-200 ease-in-out hover:border-green-400 hover:bg-green-100 focus:ring-2 focus:ring-green-500/20 focus:outline-none dark:border-green-600 dark:bg-green-900/30 dark:text-green-300 dark:hover:border-green-500 dark:hover:bg-green-900/50"
          >
            + Add {metadata.title ?? path[path.length - 1]}
          </button>
        )
      )}
    </div>
  )
}
