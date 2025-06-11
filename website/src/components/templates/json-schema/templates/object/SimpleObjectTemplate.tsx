import React from 'react'
import {
	ObjectSchema,
	FormgenJSONSchema7,
	useErrorsAtPath,
	useFormContext,
	FormState,
	useRenderTemplate,
	useIsRequired,
} from '@react-formgen/json-schema'

import { ReadonlyComplexTemplate } from '../../common/ReadonlyComplexTemplate'

/**
 * SimpleObjectTemplate
 * Renders a simple object schema by rendering each property.
 * @param {Object} props - The props for the component.
 * @param {ObjectSchema} props.schema - The schema of the object.
 * @param {string[]} props.path - The path to the object in the form data.
 * @returns {JSX.Element} - The simple object template component.
 */
export const SimpleObjectTemplate: React.FC<{
	schema: ObjectSchema
	path: string[]
}> = ({ schema, path }) => {
	const errorsAtPath = useErrorsAtPath(path)
	const readonly = useFormContext((state: FormState) => state.readonly)
	const RenderTemplate = useRenderTemplate()
	const required = useIsRequired(path)

	if (readonly) {
		return (
			<ReadonlyComplexTemplate
				title={schema.title}
				description={schema.description}
			>
				{schema.properties && Object.keys(schema.properties).length > 0 ? (
					Object.keys(schema.properties).map((key) => (
						<RenderTemplate
							key={key}
							schema={schema.properties?.[key] as FormgenJSONSchema7}
							path={[...path, key]}
						/>
					))
				) : (
					<div style={{ color: '#888' }}>No data available</div>
				)}
			</ReadonlyComplexTemplate>
		)
	}

	return (
		<div
			style={{
				width: '100%',
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
			{schema.description && <small>{schema.description}</small>}
			{errorsAtPath &&
				errorsAtPath.map((error, index) => (
					<div key={index} style={{ color: 'red', width: '100%' }}>
						{error.message}
					</div>
				))}
			<div
				style={{
					border: '0.125rem solid',
					padding: '1rem',
					...{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '1rem',
					},
				}}
			>
				{schema.properties &&
					Object.keys(schema.properties).map((key) => (
						<RenderTemplate
							key={key}
							schema={schema.properties?.[key] as FormgenJSONSchema7}
							path={[...path, key]}
						/>
					))}
			</div>
		</div>
	)
}
