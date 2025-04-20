import React from 'react'
import {
	StringSchema,
	NumberSchema,
	useFormDataAtPath,
	useErrorsAtPath,
	useFormContext,
	FormState,
	useIsRequired,
} from '@react-formgen/json-schema'

import { ReadonlyPrimitiveTemplate } from '../../common/ReadonlyPrimitiveTemplate'
import { ErrorsList } from '../../common/ErrorsList'
import { WrapperStyle } from '../../common/WrapperStyle'
import { useWindowSize } from '../../hooks/useWindowSize'

/**
 * SelectTemplate
 * Renders a select dropdown field for string or number schemas with enum or oneOf options.
 * @param {StringSchema|NumberSchema} props.schema - The schema for the select field.
 * @param {string[]} props.path - The path to the select field in the form data.
 * @returns {JSX.Element} - The select field component.
 */
export const SelectTemplate: React.FC<{
	schema: StringSchema | NumberSchema
	path: string[]
}> = ({ schema, path }) => {
	const [valueAtPath, setValueAtPath] = useFormDataAtPath(path, '')
	const errorsAtPath = useErrorsAtPath(path)
	const readonly = useFormContext((state: FormState) => state.readonly)
	const size = useWindowSize()
	const required = useIsRequired(path)

	if (readonly) {
		const selectedOption =
			schema.enum?.find((opt) => opt === valueAtPath) ||
			schema.oneOf?.find((opt) => opt.const === valueAtPath)?.title ||
			valueAtPath

		return (
			<ReadonlyPrimitiveTemplate
				title={schema.title ?? undefined}
				value={selectedOption}
				description={schema.description ?? undefined}
			/>
		)
	}

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setValueAtPath(event.target.value)
	}

	return (
		<div
			style={{
				width: size.width && size.width > 640 ? 'min-content' : '100%',
				...WrapperStyle,
			}}
		>
			{schema.title && (
				<label style={{ fontWeight: '600' }}>
					{schema.title}
					{required && <span style={{ color: 'red' }}>*</span>}
				</label>
			)}
			<select
				value={valueAtPath}
				disabled={schema.readOnly}
				onChange={handleChange}
				style={{
					width: size.width && size.width > 640 ? '12rem' : '100%',
					padding: '8px',
					border: '1px solid #d1d5db',
					borderRadius: '0.375rem',
					boxSizing: 'border-box',
				}}
			>
				<option value=""></option>
				{schema.enum
					? schema.enum.map((option, index) => (
							<option key={index} value={option}>
								{option}
							</option>
						))
					: schema.oneOf?.map((option) => (
							<option key={option.const} value={option.const}>
								{option.title}
							</option>
						))}
			</select>
			{schema.description && <small>{schema.description}</small>}
			{errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
		</div>
	)
}
