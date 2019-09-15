import {$, browser} from 'protractor';
import {join} from 'path';

describe('save methods folder options', () => {
	const testOptions = {
		returnAllCompareData: true,
		actualFolder: join(process.cwd(), './.tmp/saveActual'),
		testFolder: './.tmp'
	};

	beforeEach(async () => {
		await browser.get('');
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(async () => await browser.executeScript('window.scrollTo(0, 0);', []));

	describe('saveFullPageScreen method with folder options', () => {
		it('should set folders using method options', async () => {
			const results = await browser.imageComparison.saveFullPageScreen('saveFullPageFolderOptions', testOptions);
			expect(results.path).toMatch(testOptions.actualFolder.replace('./', ''));
		});

		it('should set folders using default options', async () => {
			const results = await browser.imageComparison.saveFullPageScreen('saveFullPageDefaultOptions', {});
			expect(results.path).toMatch('.tmp');
		});
	});

	describe('saveScreen method with folder options', () => {
		it('should set folders using method options', async () => {
			const results = await browser.imageComparison.saveScreen('saveScreenFolderOptions', testOptions);
			expect(results.path).toMatch(testOptions.actualFolder.replace('./', ''));
		});

		it('should set folders using default options', async () => {
			const results = await browser.imageComparison.saveScreen('saveScreenDefaultOptions', {});
			expect(results.path).toMatch('.tmp');
		});
	});

	describe('saveElement method with folder options', () => {
		it('should set folders using method options', async () => {
			const results = await browser.imageComparison.saveElement($('.uk-button:nth-child(1)'), 'saveElementFolderOptions', testOptions);
			expect(results.path).toMatch(testOptions.actualFolder.replace('./', ''));
		});

		it('should set folders using default options', async () => {
			const results = await browser.imageComparison.saveElement($('.uk-button:nth-child(1)'), 'saveElementDefaultOptions', {});
			expect(results.path).toMatch('.tmp');
		});
	});
});
