import { accessSync } from 'fs';

/**
 * Check if a file exists
 *
 * @param {string} filePath the file path
 *
 * @return {boolean}
 */
export default function fileExists(filePath) {
	try {
		accessSync(filePath);
		return true;
	} catch (err) {
		return false;
	}
}