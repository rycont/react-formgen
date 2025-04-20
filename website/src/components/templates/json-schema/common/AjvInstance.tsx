import Ajv from 'ajv'
import addFormats from 'ajv-formats'

// Single shared Ajv instance with formats
export const AjvInstance = new Ajv({
	allErrors: true,
	verbose: true,
}).addKeyword('uiSchema')
addFormats(AjvInstance)
