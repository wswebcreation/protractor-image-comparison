import { outputFile } from 'fs-extra';

/**
 * Save the base64 image to a file
 *
 * @param {string} base64Image
 * @param {string} filePath
 *
 * @returns {Promise<void>}
 */
export default async function saveBase64Image(base64Image, filePath) {
	return outputFile(filePath, base64Image, 'base64');
}
