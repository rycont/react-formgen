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
 * MultiSelectCheckboxTemplate
 * Renders a set of checkboxes for multi-select arrays with unique items.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The multi-select checkbox component.
 */
export const MultiSelectCheckboxTemplate: React.FC<{
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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedValue = event.target.value
		const updatedValues = valueAtPath.includes(selectedValue)
			? valueAtPath.filter((item: string) => item !== selectedValue)
			: [...valueAtPath, selectedValue]
		setValueAtPath(updatedValues)
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
			<div style={{ marginTop: '8px' }}>
				{options
					.filter(
						(option) =>
							option.value !== undefined && option.label !== undefined,
					)
					.map((option) => (
						<div
							key={String(option.value)}
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '8px',
							}}
						>
							<input
								type="checkbox"
								value={String(option.value)}
								checked={valueAtPath.includes(option.value)}
								onChange={handleChange}
								disabled={readonly}
								style={{ marginRight: '8px' }}
							/>
							<label style={{ fontSize: '14px' }}>{String(option.label)}</label>
						</div>
					))}
			</div>
			{errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
		</div>
	)
}
