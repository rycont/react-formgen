import React from 'react'
import { ErrorObject } from 'ajv'

/**
 * ErrorsList
 * Displays a list of validation errors for a given path.
 * @param {Object} props - The props for the component.
 * @param {ErrorObject[]} props.errorsAtPath - The list of error objects at the path.
 * @returns {JSX.Element} - The errors list component.
 */
export const ErrorsList: React.FC<{ errorsAtPath: ErrorObject[] }> = ({
	errorsAtPath,
}) => {
	return errorsAtPath.map((error, index) => (
		<div key={index} style={{ color: 'red', width: '100%' }}>
			{error.message}
		</div>
	))
}
