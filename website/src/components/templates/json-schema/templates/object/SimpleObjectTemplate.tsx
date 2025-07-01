import React from 'react'
import {
  ObjectSchema,
  FormgenJSONSchema7,
  useErrorsAtPath,
  useFormContext,
  FormState,
  useRenderTemplate,
  useIsRequired,
} from '@react-formgen/json-schema'

export const ReadonlySimpleObjectTemplate: React.FC<{
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
 * SimpleObjectTemplate
 * Renders a simple object schema by rendering each property.
 * @param {Object} props - The props for the component.
 * @param {ObjectSchema} props.schema - The schema of the object.
 * @param {string[]} props.path - The path to the object in the form data.
 * @returns {JSX.Element} - The simple object template component.
 */
export const SimpleObjectTemplate: React.FC<{
  schema: ObjectSchema
  path: string[]
}> = ({ schema, path }) => {
  const errorsAtPath = useErrorsAtPath(path)
  const readonly = useFormContext((state: FormState) => state.readonly)
  const RenderTemplate = useRenderTemplate()
  const required = useIsRequired(path)

  if (readonly) {
    return (
      <ReadonlySimpleObjectTemplate
        title={schema.title}
        description={schema.description}
      >
        {schema.properties && Object.keys(schema.properties).length > 0 ? (
          Object.keys(schema.properties).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.properties?.[key] as FormgenJSONSchema7}
              path={[...path, key]}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic dark:text-gray-400">
            No data available
          </div>
        )}
      </ReadonlySimpleObjectTemplate>
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

      {schema.description && (
        <small className="-mt-1 text-xs text-gray-500 dark:text-gray-400">
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

      <div
        className={`rounded-lg border-2 p-4 ${
          errorsAtPath && errorsAtPath.length > 0
            ? 'border-red-200 bg-red-50/30 dark:border-red-700 dark:bg-red-900/10'
            : 'border-gray-200 bg-gray-50/30 dark:border-gray-700 dark:bg-gray-800/30'
        } flex flex-wrap gap-4`}
      >
        {schema.properties && Object.keys(schema.properties).length > 0 ? (
          Object.keys(schema.properties).map((key) => (
            <RenderTemplate
              key={key}
              schema={schema.properties?.[key] as FormgenJSONSchema7}
              path={[...path, key]}
            />
          ))
        ) : (
          <div className="w-full py-4 text-center text-sm text-gray-500 italic dark:text-gray-400">
            No properties defined
          </div>
        )}
      </div>
    </div>
  )
}
