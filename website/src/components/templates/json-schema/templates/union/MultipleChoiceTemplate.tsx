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

// Memoized MultipleChoiceOptionTemplate to prevent re-renders unless its props change
const MultipleChoiceOptionTemplate: React.FC<{
	value: string
	title: string
	checked: boolean
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	disabled?: boolean
}> = React.memo(({ value, title, checked, onChange, disabled }) => {
	return (
		<label style={{ display: 'flex', alignItems: 'center' }}>
			<input
				type="radio"
				value={value}
				disabled={disabled}
				checked={checked}
				onChange={onChange}
				style={{
					height: '16px',
					width: '16px',
					marginRight: '8px',
				}}
			/>
			<span>{title}</span>
		</label>
	)
})

/**
 * MultipleChoiceTemplate
 * Renders a multiple-choice field as radio buttons for string schemas with enum or oneOf options.
 * @param {Object} props - The props for the component.
 * @param {StringSchema} props.schema - The schema for the multiple-choice field.
 * @param {string[]} props.path - The path to the field in the form data.
 * @returns {JSX.Element} - The multiple-choice field component.
 */
export const MultipleChoiceTemplate: React.FC<{
	schema: StringSchema
	path: string[]
}> = ({ schema, path }) => {
	const [valueAtPath, setValueAtPath] = useFormDataAtPath(path)
	const errorsAtPath = useErrorsAtPath(path)
	const readonly = useFormContext((state: FormState) => state.readonly)
	const required = useIsRequired(path)

	const handleChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setValueAtPath(event.target.value)
		},
		[setValueAtPath],
	)

	// Memoize the options to prevent unnecessary recalculations
	const opts: { value: string; title: string }[] = React.useMemo(() => {
		const options: { value: string; title: string }[] = []
		if (schema.enum) {
			schema.enum.forEach((opt) => options.push({ value: opt, title: opt }))
		} else if (schema.oneOf) {
			schema.oneOf.forEach((opt) =>
				options.push({ value: opt.const, title: opt.title ?? opt.const }),
			)
		}
		return options
	}, [schema.enum, schema.oneOf])

	// Memoize the option rendering to avoid recreating the function on every render
	const renderOption = React.useCallback(
		(option: { value: string; title: string }, index: number) => {
			return (
				<MultipleChoiceOptionTemplate
					key={index}
					value={option.value}
					title={option.title}
					checked={valueAtPath === option.value}
					onChange={handleChange}
					disabled={schema.readOnly}
				/>
			)
		},
		[valueAtPath, handleChange, schema.readOnly],
	)

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
			<div>{opts.map((option, index) => renderOption(option, index))}</div>
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
