import { Form, FormProvider, useFormContext } from '@react-formgen/json-schema'
import {
  jsonSchema,
  jsonSchemaBasic,
  jsonSchemaWithRecursiveRefs,
} from '../schemas/jsonSchema'
import { SwitchToReadonly } from '../components/SwitchToReadonly.tsx'
import { BaseFormRoot } from '../components/templates/json-schema/BaseFormRoot.tsx'
import { BaseTemplates } from '../components/templates/json-schema/templates/index.tsx'

const initialFormData = {
  firstName: 'John Doe',
  lastName: 'Doe John',
  age: 69,
  email: 'johndoe@joedohn.com',
}

/**
 * JsonSchemaExample
 * This example demonstrates how to use the `Form` component
 * to render a form based on a JSON schema. The `Form` component
 */
const JsonSchemaExample = () => {
  return (
    <div className="mx-auto flex flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          JSON Schema Form
        </h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          This form demonstrates a basic JSON schema form with a simple schema
          and initial data. The form will validate the data based on the schema
          and display errors if the data is invalid.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Form
          templates={BaseTemplates}
          formRoot={BaseFormRoot}
          schema={jsonSchemaBasic}
          initialData={initialFormData}
          onSubmit={(data) => console.log('JSON Schema:', data)}
          onError={(errors, data) =>
            console.error('JSON Schema:', errors, data)
          }
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          JSON Schema Form (Readonly)
        </h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Form
          templates={BaseTemplates}
          formRoot={BaseFormRoot}
          schema={jsonSchemaBasic}
          initialData={initialFormData}
          readonly
        />
      </div>
    </div>
  )
}

/**
 * JsonSchemaComplexExample
 * This example demonstrates a more advanced use case
 * where the `FormProvider` is used instead of the `Form`
 * component in order to use custom components that
 * require access to the form's context. In this case,
 * the `SwitchToReadonly` component is used to toggle
 * the form between editable and readonly states.
 */
const JsonSchemaComplexExample = () => {
  return (
    <div className="mx-auto flex flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Complex JSON Schema Form
        </h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          This form demonstrates a more complex JSON schema form with a custom
          form provider and initial data. The form will validate the data based
          on the schema and display errors if the data is invalid.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <FormProvider
          schema={jsonSchema}
          initialData={initialFormData}
          templates={BaseTemplates}
        >
          <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <SwitchToReadonly contextHook={useFormContext} />
          </div>
          <BaseFormRoot
            onSubmit={(data) => console.log('JSON Schema:', data)}
            onError={(errors, data) =>
              console.error('JSON Schema:', errors, data)
            }
          />
        </FormProvider>
      </div>
    </div>
  )
}

/**
 * JsonSchemaWithRecursiveRefsExample
 * This example demonstrates the use of a JSON schema
 * with recursive references, which are not currently
 * supported by the form generator. The form will
 * render with unresolvable fields.
 */
const JsonSchemaWithRecursiveRefsExample = () => {
  return (
    <div className="mx-auto flex flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          JSON Schema Unresolvable Form
        </h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          This form demonstrates a JSON schema with recursive references, which
          are not currently supported by the form generator. The form will
          render with unresolvable fields.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Form
          formRoot={BaseFormRoot}
          templates={BaseTemplates}
          schema={jsonSchemaWithRecursiveRefs}
          onSubmit={(data) => console.log('JSON Schema:', data)}
          onError={(errors, data) =>
            console.error('JSON Schema:', errors, data)
          }
        />
      </div>
    </div>
  )
}

/**
 * JsonSchemaWithDevToolsExample
 * This example demonstrates how to enable the Zustand DevTools (using Redux DevTools)
 * for the form state, which allows you to inspect and manipulate
 * the form state in real-time.
 *
 * Note: To access the DevTools, open the browser's developer
 * tools and navigate to the Redux DevTools tab.
 *
 * Warning: Enabling the DevTools sets the internal Zustand store's
 * state to be exposed to the browser's DevTools. This should only be used
 * in development mode or non-sensitive environments, as it may expose
 * application state and user data. Avoid enabling it in production
 * environments where sensitive information is handled.
 */
const JsonSchemaWithDevToolsExample = () => {
  // Enable the DevTools only in development mode
  // const enableDevtools = process.env.NODE_ENV === "development";

  // Enable the DevTools in all environments (just for demonstration purposes)
  const enableDevtools = true

  return (
    <div className="mx-auto flex flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          JSON Schema Form with DevTools
        </h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          The Zustand DevTools are enabled for this form. Open the browser's
          developer tools and navigate to the Redux DevTools tab to inspect and
          manipulate the form state.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Form
          formRoot={BaseFormRoot}
          templates={BaseTemplates}
          schema={jsonSchemaBasic}
          initialData={initialFormData}
          onSubmit={(data) => console.log('JSON Schema:', data)}
          onError={(errors) => console.error('JSON Schema:', errors)}
          enableDevtools={enableDevtools}
        />
      </div>
    </div>
  )
}

export {
  JsonSchemaExample,
  JsonSchemaComplexExample,
  JsonSchemaWithRecursiveRefsExample,
  JsonSchemaWithDevToolsExample,
}
