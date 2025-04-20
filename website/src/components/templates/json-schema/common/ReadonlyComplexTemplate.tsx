import React from 'react'

/**
 * ReadonlyComplexTemplate
 * Renders a readonly view of complex data (objects or arrays) with a title and description.
 * @param {Object} props - The props for the component.
 * @param {string} [props.title] - The title of the field.
 * @param {string} [props.description] - The description of the field.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} - The readonly complex component.
 */
export const ReadonlyComplexTemplate: React.FC<{
	title?: string
	description?: string
	children: React.ReactNode
}> = ({ title, description, children }) => {
	return (
		<div
			style={{
				width: '100%',
				marginBottom: '1rem',
				paddingLeft: '1rem',
				borderLeft: '2px solid #ccc',
			}}
		>
			{title && <strong>{title}</strong>}
			{description && (
				<p style={{ fontSize: 'small', color: '#666' }}>{description}</p>
			)}
			<div style={{ marginTop: '0.5rem' }}>{children}</div>
		</div>
	)
}
