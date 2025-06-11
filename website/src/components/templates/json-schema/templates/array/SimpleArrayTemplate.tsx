import React from 'react'
import {
	ArraySchema,
	FormgenJSONSchema7,
	useFormContext,
	useArrayTemplate,
	FormState,
	useRenderTemplate,
	generateInitialData,
	useIsRequired,
} from '@react-formgen/json-schema'

import { ReadonlyComplexTemplate } from '../../common/ReadonlyComplexTemplate'

/**
 * SimpleArrayTemplate
 * Renders an array schema where items are of the same type.
 * @param {Object} props - The props for the component.
 * @param {ArraySchema} props.schema - The schema of the array.
 * @param {string[]} props.path - The path to the array in the form data.
 * @returns {JSX.Element} - The simple array template component.
 */
export const SimpleArrayTemplate: React.FC<{
	schema: ArraySchema
	path: string[]
}> = ({ schema, path }) => {
	const readonly = useFormContext((state: FormState) => state.readonly)
	const definitions = useFormContext(
		(state: FormState) => state.schema.definitions || {},
	)
	const RenderTemplate = useRenderTemplate()

	const { valueAtPath, errorsAtPath, moveItem, removeItem, addItem } =
		useArrayTemplate(path, () =>
			generateInitialData(schema.items as FormgenJSONSchema7, definitions),
		)
	const required = useIsRequired(path)

	if (readonly) {
		return (
			<ReadonlyComplexTemplate
				title={schema.title}
				description={schema.description}
			>
				{Array.isArray(valueAtPath) && valueAtPath.length > 0 ? (
					valueAtPath.map((_, index: number) => (
						<div key={index} style={{ marginBottom: '0.5rem' }}>
							<RenderTemplate
								schema={schema.items as FormgenJSONSchema7}
								path={[...path, index.toString()]}
							/>
						</div>
					))
				) : (
					<div style={{ color: '#888' }}>No items available</div>
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
					border: '0.25rem dashed',
					padding: '1rem',
					...{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '1rem',
					},
				}}
			>
				{schema.items &&
					Array.isArray(valueAtPath) &&
					valueAtPath.map((_, index: number) => (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '1rem',
								width: '100%',
							}}
							key={index}
						>
							<RenderTemplate
								schema={schema.items as FormgenJSONSchema7}
								path={[...path, index.toString()]}
							/>
							<div
								style={{
									display: 'flex',
									gap: '1rem',
									paddingBottom: '1rem',
									borderBottom: '0.125rem dashed',
								}}
							>
								<button
									type="button"
									onClick={() => moveItem(index, 'up')}
									disabled={index === 0}
								>
									Move Up
								</button>
								<button
									type="button"
									onClick={() => moveItem(index, 'down')}
									disabled={index === valueAtPath.length - 1}
								>
									Move Down
								</button>
								<button type="button" onClick={() => removeItem(index)}>
									Remove
								</button>
							</div>
						</div>
					))}
				<button
					type="button"
					onClick={addItem}
					style={{
						width: '100%',
					}}
				>
					Add Item
				</button>
			</div>
		</div>
	)
}
