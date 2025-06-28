import { FormState as JsonSchemaFormState } from '@react-formgen/json-schema'
import { FormState as YupFormState } from '@react-formgen/yup'
import { FormState as ZodFormState } from '@react-formgen/zod'

/**
 * Generic hook that returns the readonly state and setter based on the context hook provided
 */
export function useFormReadonly<
  T extends JsonSchemaFormState | YupFormState | ZodFormState,
>(contextHook: <U>(selector: (state: T) => U) => U) {
  const readonly = contextHook((state) => state.readonly)
  const setReadonly = contextHook((state) => state.setReadonly)
  return { readonly, setReadonly }
}

/**
 * Generic SwitchToReadonly component that accepts a context hook and uses it to access the form state
 * Renders a styled toggle switch for switching between readonly and editable modes
 */
export const SwitchToReadonly = <
  T extends JsonSchemaFormState | YupFormState | ZodFormState,
>({
  contextHook,
}: {
  contextHook: <U>(selector: (state: T) => U) => U
}) => {
  const { readonly, setReadonly } = useFormReadonly(contextHook)

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Form Mode
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {readonly ? 'Currently in readonly mode' : 'Currently editable'}
        </span>
      </div>

      <label
        className={`flex cursor-pointer items-center space-x-3 transition-all duration-200 ease-in-out`}
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Readonly
        </span>

        <input
          type="checkbox"
          checked={readonly}
          onChange={(e) => setReadonly(e.target.checked)}
          className={`h-4 w-4 rounded border-gray-300 bg-white text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-400`}
        />
      </label>
    </div>
  )
}
