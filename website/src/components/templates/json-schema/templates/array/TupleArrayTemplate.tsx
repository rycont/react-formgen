import React from 'react'
import {
	ArraySchema,
	FormgenJSONSchema7,
	useFormDataAtPath,
	useErrorsAtPath,
	useFormContext,
	FormState,
	useRenderTemplate,
	resolveSchema,
	useIsRequired,
} from '@react-formgen/json-schema'

/**
 * TupleArrayTemplate
 * Renders a tuple array where each item has a different schema.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema for the array property.
 * @param {string[]} props.path - The path to the array property in the form data.
 * @returns {JSX.Element} - The tuple array template component.
 */
export const TupleArrayTemplate: React.FC<{
	schema: ArraySchema
	path: string[]
}> = ({ schema, path }) => {
	// To account for the elements of the tuple array having their respective data generated at form creation and the effect this has on validation, we need to first check if this tuple is a required property. If it's not, then we should reset the tuple's initial data to an empty array.
	const rootSchema = useFormContext((state: FormState) => state.schema)
	// We can use the current path and cross reference it with the root schema to determine if this tuple instance is a required property of its parent object.
	const parentPath = path.slice(0, -1)
	// We'll get the parent schema by iterating through the root schema using the parent path, resolving any $ref schemas along the way.
	let parentSchema = rootSchema
	for (const key of parentPath) {
		const newSchema =
			parentSchema.type === 'object'
				? (resolveSchema(
						parentSchema.properties?.[key] as FormgenJSONSchema7,
						rootSchema.definitions,
					) as FormgenJSONSchema7)
				: (resolveSchema(
						parentSchema.items as FormgenJSONSchema7,
						rootSchema.definitions,
					) as FormgenJSONSchema7)

		parentSchema = newSchema
	}

	const isRequired = parentSchema?.required?.includes(path[path.length - 1])

	const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
	const [parentValue, setParentValue] = useFormDataAtPath(parentPath)
	const errorsAtPath = useErrorsAtPath(path)
	const readonly = useFormContext((state: FormState) => state.readonly)
	const RenderTemplate = useRenderTemplate()
	const required = useIsRequired(path)

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
			{valueAtPath ? (
				<>
					{schema.title && (
						<label style={{ fontWeight: '600' }}>
							{schema.title}
							{required && <span style={{ color: 'red' }}>*</span>}
						</label>
					)}
					{schema.description && <small>{schema.description}</small>}
					<div
						style={{
							marginBottom: '16px',
							width: '100%',
							...{
								display: 'flex',
								flexWrap: 'wrap',
								gap: '1rem',
							},
						}}
					>
						{errorsAtPath &&
							errorsAtPath.map((error, index) => (
								<div key={index} style={{ color: 'red', width: '100%' }}>
									{error.message}
								</div>
							))}
						{Array.isArray(schema.items) &&
							schema.items.map((itemSchema, index) => (
								<RenderTemplate
									key={index}
									schema={itemSchema as FormgenJSONSchema7}
									path={[...path, index.toString()]}
								/>
							))}
					</div>
					{/* If the tuple is not required, render a button to remove it */}
					{!readonly && !isRequired && valueAtPath && (
						<button
							onClick={() =>
								setParentValue({
									...parentValue,
									[path[path.length - 1]]: undefined,
								})
							}
							type="button"
							style={{
								width: '100%',
							}}
						>
							Remove {schema.title ?? path[path.length - 1]}
						</button>
					)}
				</>
			) : (
				!readonly && (
					<button
						onClick={() => setValueAtPath([])}
						type="button"
						style={{
							width: '100%',
						}}
					>
						Add {schema.title ?? path[path.length - 1]}
					</button>
				)
			)}
		</div>
	)
}
