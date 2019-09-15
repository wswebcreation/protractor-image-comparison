import {$, browser} from 'protractor';
import {join} from 'path';

describe('check methods folder options', () => {

	beforeEach(async () => {
		await browser.get('');
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(async () => await browser.executeScript('window.scrollTo(0, 0);', []));

	describe('checkFullPageScreen method with folder options', () => {
		it('should set all folders using method options', async () => {
			const baselineFolder = (await browser.getProcessedConfig()).sauceUser ? 'tests/sauceLabsBaseline' : 'localBaseline';
			const testOptions = {
				actualFolder: join(process.cwd(), './.tmp/checkActual'),
				baselineFolder: join(process.cwd(), `./${baselineFolder}/checkBaseline`),
				diffFolder: join(process.cwd(), './.tmp/testDiff'),
				returnAllCompareData: true
			};
			const results = await browser.imageComparison.checkFullPageScreen('fullPageCheckFolders', testOptions);

			expect(results.folders.actual).toMatch(testOptions.actualFolder.replace('./', ''));
			expect(results.folders.baseline).toMatch(testOptions.baselineFolder.replace('./', ''));
			expect(results.folders.diff).toMatch(testOptions.diffFolder.replace('./', ''));
		});
	});

	describe('checkScreen method with folder options', () => {
		it('should set all folders using method options', async () => {
			const baselineFolder = (await browser.getProcessedConfig()).sauceUser ? 'tests/sauceLabsBaseline' : 'localBaseline';
			const testOptions = {
				actualFolder: join(process.cwd(), './.tmp/checkActual'),
				baselineFolder: join(process.cwd(), `./${baselineFolder}/checkBaseline`),
				diffFolder: join(process.cwd(), './.tmp/testDiff'),
				returnAllCompareData: true
			};
			const results = await browser.imageComparison.checkScreen('screenCheckFolders', testOptions);

			expect(results.folders.actual).toMatch(testOptions.actualFolder.replace('./', ''));
			expect(results.folders.baseline).toMatch(testOptions.baselineFolder.replace('./', ''));
			expect(results.folders.diff).toMatch(testOptions.diffFolder.replace('./', ''));
		});
	});

	describe('checkElement method with folder options', () => {
		it('should set all folders using method options', async () => {
			const baselineFolder = (await browser.getProcessedConfig()).sauceUser ? 'tests/sauceLabsBaseline' : 'localBaseline';
			const testOptions = {
				actualFolder: join(process.cwd(), './.tmp/checkActual'),
				baselineFolder: join(process.cwd(), `./${baselineFolder}/checkBaseline`),
				diffFolder: join(process.cwd(), './.tmp/testDiff'),
				returnAllCompareData: true
			};
			const results = await browser.imageComparison.checkElement($('.uk-button:nth-child(1)'), 'elementCheckFolders', testOptions);

			expect(results.folders.actual).toMatch(testOptions.actualFolder.replace('./', ''));
			expect(results.folders.baseline).toMatch(testOptions.baselineFolder.replace('./', ''));
			expect(results.folders.diff).toMatch(testOptions.diffFolder.replace('./', ''));
		});
	});
});
