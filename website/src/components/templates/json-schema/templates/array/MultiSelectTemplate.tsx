import React from 'react'
import {
	ArraySchema,
	FormgenJSONSchema7,
	useFormDataAtPath,
	useErrorsAtPath,
	useFormContext,
	FormState,
	useIsRequired,
} from '@react-formgen/json-schema'

import { ErrorsList } from '../../common/ErrorsList'
import { WrapperStyle } from '../../common/WrapperStyle'

/**
 * MultiSelectTemplate
 * Renders a multi-select dropdown for arrays with unique items.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The multi-select field component.
 */
export const MultiSelectTemplate: React.FC<{
	schema: ArraySchema
	path: string[]
}> = ({ schema, path }) => {
	const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, [])
	const errorsAtPath = useErrorsAtPath(path)
	const readonly = useFormContext((state: FormState) => state.readonly)
	const required = useIsRequired(path)

	const options = React.useMemo(() => {
		if (typeof schema.items === 'object' && !Array.isArray(schema.items)) {
			if ('enum' in schema.items && schema.items.enum) {
				return schema.items.enum.map((option) => ({
					value: option,
					label: option,
				}))
			} else if ('oneOf' in schema.items && schema.items.oneOf) {
				return schema.items.oneOf
					.filter(
						(item): item is FormgenJSONSchema7 =>
							typeof item === 'object' && !Array.isArray(item),
					)
					.map((option) => ({
						value: option.const,
						label: option.title,
					}))
			}
		}
		return []
	}, [schema])

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = Array.from(
			event.target.selectedOptions,
			(option) => option.value,
		)
		setValueAtPath(selectedOptions)
	}

	return (
		<div style={WrapperStyle}>
			{schema.title && (
				<label style={{ fontWeight: '600' }}>
					{schema.title}
					{required && <span style={{ color: 'red' }}>*</span>}
				</label>
			)}
			{schema.description && <small>{schema.description}</small>}
			<select
				multiple
				value={valueAtPath}
				onChange={handleChange}
				disabled={readonly}
				style={{
					width: '100%',
					padding: '8px',
					border: '1px solid #d1d5db',
					borderRadius: '8px',
				}}
			>
				{options.map((option) => (
					<option key={String(option.value)} value={String(option.value)}>
						{String(option.label)}
					</option>
				))}
			</select>
			{errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
		</div>
	)
}
