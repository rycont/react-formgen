import React from 'react'
import {
  ArraySchema,
  FormgenJSONSchema7,
  useFormDataAtPath,
  useErrorsAtPath,
  useFormContext,
  FormState,
  useRenderTemplate,
  resolveSchema,
  useIsRequired,
} from '@react-formgen/json-schema'

/**
 * TupleArrayTemplate
 * Renders a tuple array where each item has a different schema.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The tuple array template component.
 */
export const TupleArrayTemplate: React.FC<{
  schema: ArraySchema
  path: string[]
}> = ({ schema, path }) => {
  // To account for the elements of the tuple array having their respective data generated at form creation and the effect this has on validation, we need to first check if this tuple is a required property. If it's not, then we should reset the tuple's initial data to an empty array.
  const rootSchema = useFormContext((state: FormState) => state.schema)
  // We can use the current path and cross reference it with the root schema to determine if this tuple instance is a required property of its parent object.
  const parentPath = path.slice(0, -1)
  // We'll get the parent schema by iterating through the root schema using the parent path, resolving any $ref schemas along the way.
  let parentSchema = rootSchema
  for (const key of parentPath) {
    const newSchema =
      parentSchema.type === 'object'
        ? (resolveSchema(
            parentSchema.properties?.[key] as FormgenJSONSchema7,
            rootSchema.definitions,
          ) as FormgenJSONSchema7)
        : (resolveSchema(
            parentSchema.items as FormgenJSONSchema7,
            rootSchema.definitions,
          ) as FormgenJSONSchema7)

    parentSchema = newSchema
  }

  const isRequired = parentSchema?.required?.includes(path[path.length - 1])

  const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
  const [parentValue, setParentValue] = useFormDataAtPath(parentPath)
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const RenderTemplate = useRenderTemplate()
  const required = useIsRequired(path)

  return (
    <div className="flex w-full flex-col space-y-3">
      {valueAtPath ? (
        <>
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
              <div
                className={`grid gap-4 ${(() => {
                  const columns = schema.uiSchema?.props?.columns
                  if (typeof columns === 'number' && columns > 0) {
                    // Generate grid-cols-{n} class based on columns value
                    return `grid-cols-${Math.min(columns, 12)}` // Cap at 12 for Tailwind safety
                  }
                  return 'grid-cols-1' // Default to 1 column
                })()}`}
              >
                {Array.isArray(schema.items) &&
                  schema.items.map((itemSchema, index) => (
                    <div key={index} className="space-y-2">
                      <RenderTemplate
                        schema={itemSchema as FormgenJSONSchema7}
                        path={[...path, index.toString()]}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* If the tuple is not required, render a button to remove it */}
          {!readonly && !isRequired && valueAtPath && (
            <button
              onClick={() =>
                setParentValue({
                  ...parentValue,
                  [path[path.length - 1]]: undefined,
                })
              }
              type="button"
              className="w-full rounded-lg border-2 border-dashed border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-all duration-200 ease-in-out hover:border-red-400 hover:bg-red-100 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-red-600 dark:bg-red-900/30 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-900/50"
            >
              Remove {schema.title ?? path[path.length - 1]}
            </button>
          )}
        </>
      ) : (
        !readonly && (
          <button
            onClick={() => setValueAtPath([])}
            type="button"
            className="w-full rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-all duration-200 ease-in-out hover:border-green-400 hover:bg-green-100 focus:ring-2 focus:ring-green-500/20 focus:outline-none dark:border-green-600 dark:bg-green-900/30 dark:text-green-300 dark:hover:border-green-500 dark:hover:bg-green-900/50"
          >
            + Add {schema.title ?? path[path.length - 1]}
          </button>
        )
      )}
    </div>
  )
}
