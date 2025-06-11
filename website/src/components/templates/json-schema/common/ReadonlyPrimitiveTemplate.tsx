import React from 'react'

export const ReadonlyPrimitiveTemplate: React.FC<{
	title?: string
	value?: string | number | boolean
	description?: string
}> = ({ title, value, description }) => {
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
			{title && <label style={{ fontWeight: '600' }}>{title}</label>}
			<div style={{ padding: '8px' }}>{value ?? 'N/A'}</div>
			{description && <small>{description}</small>}
		</div>
	)
}
