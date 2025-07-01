import { Form, FormProvider, useFormContext } from '@react-formgen/zod'
import { zodSchema, zodSchemaBasic } from '../schemas/zodSchema'
import { SwitchToReadonly } from '../components/SwitchToReadonly.tsx'
import { BaseFormRoot } from '../components/templates/zod/BaseFormRoot.tsx'
import { BaseTemplates } from '../components/templates/zod/templates/index.ts'

const initialFormData = {
  firstName: 'John Doe',
  lastName: 'Doe John',
  age: 69,
  email: 'johndoe@joedohn.com',
}

/**
 * ZodSchemaExample
 * This example demonstrates how to use the `Form` component
 * to render a form based on a Zod schema. The `Form` component
 */
const ZodSchemaExample = () => {
  return (
    <div className="mx-auto flex flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Zod Schema Form
        </h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          This form demonstrates a basic Zod schema form with a simple schema
          and initial data. The form will validate the data based on the schema
          and display errors if the data is invalid.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Form
          templates={BaseTemplates}
          formRoot={BaseFormRoot}
          schema={zodSchemaBasic}
          initialData={initialFormData}
          onSubmit={(data) => console.log('Zod Schema:', data)}
          onError={(errors, data) => console.error('Zod Schema:', errors, data)}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Zod Schema Form (Readonly)
        </h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <Form
          templates={BaseTemplates}
          formRoot={BaseFormRoot}
          schema={zodSchemaBasic}
          initialData={initialFormData}
          readonly
        />
      </div>
    </div>
  )
}

/**
 * ZodSchemaComplexExample
 * This example demonstrates a more advanced use case
 * where the `FormProvider` is used instead of the `Form`
 * component in order to use custom components that
 * require access to the form's context. In this case,
 * the `SwitchToReadonly` component is used to toggle
 * the form between editable and readonly states.
 */
const ZodSchemaComplexExample = () => {
  return (
    <div className="mx-auto flex flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Complex Zod Schema Form
        </h2>
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
          This form demonstrates a more complex Zod schema form with a custom
          form provider and initial data. The form will validate the data based
          on the schema and display errors if the data is invalid.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <FormProvider
          schema={zodSchema}
          initialData={initialFormData}
          templates={BaseTemplates}
        >
          <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <SwitchToReadonly contextHook={useFormContext} />
          </div>
          <BaseFormRoot
            onSubmit={(data) => console.log('Zod Schema:', data)}
            onError={(errors, data) =>
              console.error('Zod Schema:', errors, data)
            }
          />
        </FormProvider>
      </div>
    </div>
  )
}

export { ZodSchemaExample, ZodSchemaComplexExample }
