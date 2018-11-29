import { access, copySync } from 'fs-extra';
import { red, yellow } from 'chalk';

/**
 * Check if the image exists and create a new baseline image if needed
 *
 * @param {string}  actualFilePath   The actual folder
 * @param {string}  baselineFilePath The baseline folder
 * @param {boolean} autoSaveBaseline Auto save image to baseline
 *
 * @return {Promise<{
 *   actualFilePath: string,
 *   baselineFilePath: string,
 * }>}
 */

export function checkBaselineImageExists(actualFilePath, baselineFilePath, autoSaveBaseline) {

	return new Promise((resolve, reject) => {
		access(baselineFilePath, error => {
			if (error) {
				if (autoSaveBaseline) {
					try {
						copySync(actualFilePath, baselineFilePath);
						console.log(yellow(`
#####################################################################################
 INFO: 
 Autosaved the image to 
 ${baselineFilePath}
#####################################################################################
`));
					} catch (error) {
						reject(red(`
#####################################################################################
 Image could not be copied. The following error was thrown: 
 ${error}
#####################################################################################
`));
					}
				} else {
					reject(red(`
#####################################################################################
 Baseline image not found, save the actual image manually to the baseline.
 The image can be found here:
 ${actualFilePath}
 If you want the module to auto save a non existing image to the baseline you
 can provide 'autoSaveBaseline: true' to the options.
#####################################################################################
`));
				}
			}
			resolve({
				actualFilePath,
				baselineFilePath,
			});
		});
	});
}