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
import { ErrorsList } from '../../common/ErrorsList'
import { WrapperStyle } from '../../common/WrapperStyle'

/**
 * RadioTemplate
 * Renders radio buttons for boolean schemas with oneOf options.
 * @param {Object} props - The props for the component.
 * @param {BooleanSchema} props.schema - The schema for the radio boolean field.
 * @param {string[]} props.path - The path to the radio boolean field in the form data.
 * @returns {JSX.Element} - The radio boolean field component.
 */
export const RadioTemplate: React.FC<{
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
				title={schema.title ?? undefined}
				value={valueAtPath ? 'true' : 'false'}
				description={schema.description ?? undefined}
			/>
		)
	}

	return (
		<div style={WrapperStyle}>
			{schema.title && (
				<label style={{ fontWeight: '600' }}>
					{schema.title}
					{required && <span style={{ color: 'red' }}>*</span>}
				</label>
			)}
			{schema.oneOf?.map((option) => (
				<label
					key={option.title}
					style={{ display: 'flex', alignItems: 'center' }}
				>
					<input
						type="radio"
						checked={valueAtPath === option.const}
						disabled={schema.readOnly}
						onChange={() => setValueAtPath(option.const)}
						style={{
							height: '16px',
							width: '16px',
							marginRight: '8px',
						}}
					/>
					<span>{option.title}</span>
				</label>
			))}
			{schema.description && <small>{schema.description}</small>}
			{errorsAtPath && <ErrorsList errorsAtPath={errorsAtPath} />}
		</div>
	)
}
