import React from 'react'
import {
  FormRootProps,
  FormgenJSONSchema7,
  useFormContext,
  FormState,
  useRenderTemplate,
} from '@react-formgen/json-schema'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

export const AjvInstance = new Ajv({
  allErrors: true,
  verbose: true,
}).addKeyword('uiSchema')
addFormats(AjvInstance)

/**
 * Form validation state for styling
 */
type FormValidationState = 'idle' | 'valid' | 'invalid'

/**
 * Gets the border classes based on form validation state
 * @param validationState - Current validation state of the form
 */
const getFormBorderClasses = (validationState: FormValidationState): string => {
  switch (validationState) {
    case 'valid':
      return 'border border-green-500 dark:border-green-400'
    case 'invalid':
      return 'border border-red-500 dark:border-red-400'
    case 'idle':
    default:
      return 'border-0'
  }
}

/**
 * Common layout classes for form containers
 */
const FORM_CONTAINER_CLASSES =
  'p-4 flex flex-wrap gap-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'

/**
 * Submit button classes
 */
const SUBMIT_BUTTON_CLASSES = `
  w-full px-4 py-2 
  bg-blue-600 hover:bg-blue-700 
  dark:bg-blue-500 dark:hover:bg-blue-600
  text-white 
  rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
  dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900
  transition-colors duration-200 
  disabled:opacity-50 disabled:cursor-not-allowed
  disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500
  font-medium
  shadow-sm hover:shadow-md dark:shadow-gray-900/50
`
  .replace(/\s+/g, ' ')
  .trim()

/**
 * BaseFormRoot
 * The root form component that renders the form based on the schema and handles submission.
 * @param {FormRootProps} props - The props for the BaseFormRoot.
 * @param {Function} props.onSubmit - Callback function when form is submitted successfully.
 * @param {Function} props.onError - Callback function when form submission has errors.
 * @returns {JSX.Element} - The form component.
 */
export const BaseFormRoot: React.FC<FormRootProps> = ({
  onSubmit,
  onError,
}) => {
  const readonly = useFormContext((state: FormState) => state.readonly)
  const schema = useFormContext((state: FormState) => state.schema)
  const formData = useFormContext((state: FormState) => state.formData)
  const setErrors = useFormContext((state: FormState) => state.setErrors)
  const RenderTemplate = useRenderTemplate()
  const [validationState, setValidationState] =
    React.useState<FormValidationState>('idle')

  if (readonly) {
    return (
      <div className={`${FORM_CONTAINER_CLASSES} rounded-lg`}>
        {Object.keys(schema.properties || {}).map((key) => (
          <RenderTemplate
            key={key}
            schema={schema.properties?.[key] as FormgenJSONSchema7}
            path={[key]}
          />
        ))}
      </div>
    )
  }

  /**
   * Handles form submission with validation
   * @param event - Form submission event
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const validate = AjvInstance.compile(schema)
    const valid = validate(formData)

    if (valid) {
      setValidationState('valid')
      setErrors(null)
      onSubmit(formData)
    } else {
      setValidationState('invalid')
      setErrors(validate.errors ?? null)
      onError(validate.errors ?? [], formData)
    }
  }

  const formClasses = `${FORM_CONTAINER_CLASSES} ${getFormBorderClasses(validationState)} rounded-lg transition-colors duration-200`

  return (
    <form onSubmit={handleSubmit} className={formClasses}>
      {Object.keys(schema.properties || {}).map((key) => (
        <RenderTemplate
          key={key}
          schema={schema.properties?.[key] as FormgenJSONSchema7}
          path={[key]}
        />
      ))}
      <button type="submit" className={SUBMIT_BUTTON_CLASSES}>
        Submit
      </button>
    </form>
  )
}
