import React from 'react'
import {
	StringSchema,
	useFormDataAtPath,
	useErrorsAtPath,
	useFormContext,
	FormState,
	useIsRequired,
} from '@react-formgen/json-schema'

import { ReadonlyPrimitiveTemplate } from '../../common/ReadonlyPrimitiveTemplate'

/**
 * TextareaTemplate
 * Renders a textarea input for multi-line string input.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the textarea field.
 * @param {string[]} props.path - The path to the textarea field in the form data.
 * @returns {JSX.Element} - The textarea field component.
 */
export const TextareaTemplate: React.FC<{
	schema: StringSchema
	path: string[]
}> = ({ schema, path }) => {
	const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
	const errorsAtPath = useErrorsAtPath(path)
	const readonly = useFormContext((state: FormState) => state.readonly)
	const required = useIsRequired(path)

	if (readonly) {
		return (
			<ReadonlyPrimitiveTemplate
				title={schema.title ?? undefined}
				value={valueAtPath}
				description={schema.description ?? undefined}
			/>
		)
	}

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValueAtPath(event.target.value)
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{schema.title && (
				<label style={{ fontWeight: '600' }}>
					{schema.title}
					{required && <span style={{ color: 'red' }}>*</span>}
				</label>
			)}
			<textarea
				value={valueAtPath ?? ''}
				disabled={schema.readOnly}
				onChange={handleChange}
				placeholder={schema.title || ''}
				style={{
					padding: '8px',
					border: '1px solid #d1d5db',
					borderRadius: '0.375rem',
				}}
			/>
			{schema.description && <small>{schema.description}</small>}
			{errorsAtPath &&
				errorsAtPath.map((error, index) => (
					<div key={index} style={{ color: 'red', width: '100%' }}>
						{error.message}
					</div>
				))}
		</div>
	)
}
