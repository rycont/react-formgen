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
import { useWindowSize } from '../../hooks/useWindowSize'

/**
 * InputTemplate
 * Renders a text input field for string and number schemas.
 * @param {Object} props - The props for the component.
 * @param {StringSchema | NumberSchema} props.schema - The schema for the input field.
 * @param {string[]} props.path - The path to the input field in the form data.
 * @param {string} [props.htmlType] - The HTML input type (default: "text").
 * @returns {JSX.Element} - The input field component.
 */
export const InputTemplate: React.FC<{
	schema: StringSchema | NumberSchema
	path: string[]
	htmlType?: string
}> = ({ schema, path, htmlType = 'text' }) => {
	const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
	const errorsAtPath = useErrorsAtPath(path)
	const readonly = useFormContext((state: FormState) => state.readonly)
	const size = useWindowSize()
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

	return (
		<div
			style={{
				width: size.width && size.width > 640 ? 'min-content' : '100%',
				...{
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			{schema.title && (
				<label style={{ fontWeight: '600' }}>
					{schema.title}
					{required && <span style={{ color: 'red' }}>*</span>}
				</label>
			)}
			<input
				type={htmlType}
				value={valueAtPath ?? ''}
				disabled={schema.readOnly}
				onChange={(e) => setValueAtPath(e.target.value ? e.target.value : null)}
				placeholder={schema.title || ''}
				style={{
					width: size.width && size.width > 640 ? '12rem' : '100%',
					padding: '8px',
					border: '1px solid #d1d5db',
					borderRadius: '0.375rem',
					boxSizing: 'border-box',
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
