import { accessSync } from 'fs';

/**
 * Check if a file exists
 */
export default function fileExists(filePath: string): boolean {
	try {
		accessSync(filePath);
		return true;
	} catch (err) {
		return false;
	}
}