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
	const [formBorder, setFormBorder] = React.useState<string>('none')

	if (readonly) {
		return (
			<div
				style={{
					padding: '1rem',
					...{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '1rem',
					},
				}}
			>
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

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		const validate = AjvInstance.compile(schema)
		const valid = validate(formData)
		if (valid) {
			setFormBorder('1px solid green')
			setErrors(null)
			onSubmit(formData)
		} else {
			setFormBorder('1px solid red')
			setErrors(validate.errors ?? null)
			onError(validate.errors ?? [], formData)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			style={{
				padding: '1rem',
				border: formBorder,
				...{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '1rem',
				},
			}}
		>
			{Object.keys(schema.properties || {}).map((key) => (
				<RenderTemplate
					key={key}
					schema={schema.properties?.[key] as FormgenJSONSchema7}
					path={[key]}
				/>
			))}
			<button
				type="submit"
				style={{
					width: '100%',
				}}
			>
				Submit
			</button>
		</form>
	)
}
