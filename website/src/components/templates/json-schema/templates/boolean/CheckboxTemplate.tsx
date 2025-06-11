import React from 'react'
import {
	BooleanSchema,
	useFormDataAtPath,
	useErrorsAtPath,
	useFormContext,
	FormState,
	useIsRequired,
} from '@react-formgen/json-schema'

import { ReadonlyPrimitiveTemplate } from '../../common/ReadonlyPrimitiveTemplate'

/**
 * CheckboxTemplate
 * Renders a checkbox for boolean schemas without oneOf options.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the checkbox boolean field.
 * @param {string[]} props.path - The path to the checkbox boolean field in the form data.
 * @returns {JSX.Element} - The checkbox boolean field component.
 */
export const CheckboxTemplate: React.FC<{
	schema: BooleanSchema
	path: string[]
}> = ({ schema, path }) => {
	const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
	const errorsAtPath = useErrorsAtPath(path)
	const readonly = useFormContext((state: FormState) => state.readonly)
	const required = useIsRequired(path)

	if (readonly) {
		return (
			<ReadonlyPrimitiveTemplate
				title={schema.title}
				value={valueAtPath ? 'true' : 'false'}
				description={schema.description}
			/>
		)
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<input
					type="checkbox"
					checked={valueAtPath}
					disabled={schema.readOnly}
					onChange={(event) => setValueAtPath(event.target.checked)}
					style={{ marginRight: '8px' }}
				/>
				{schema.title && (
					<label style={{ fontSize: '0.875rem' }}>
						{schema.title}
						{required && <span style={{ color: 'red' }}>*</span>}
					</label>
				)}
			</div>
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
