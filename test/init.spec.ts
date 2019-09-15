import {$, browser} from 'protractor';
import {copy} from 'fs-extra';
import {normalize, join} from 'path'

describe('protractor-image-comparison local development initialization', () => {
	const localBaseline = 'localBaseline';
	const checkBaseline = 'checkBaseline';
	const firstButton = $('.uk-button:nth-child(1)');

	beforeEach(async () => {
		await browser.get(browser.baseUrl);
		await browser.sleep(500);
	});

	// Chrome remembers the last postion when the url is loaded again, this will reset it.
	afterEach(() => browser.executeScript('window.scrollTo(0, 0);'));

	it('should save the compare screenshot screenshots', async () => {
		const examplePage = 'examplePage';
		const examplePageFail = 'examplePageFail';
		const {fileName, path} = await browser.imageComparison.saveScreen(examplePage);

		await copy(normalize(`${path}/${fileName}`), join(process.cwd(), `./${localBaseline}/${path.split('/').pop()}/${fileName}`));
		await copy(
			normalize(`${path}/${fileName}`),
			join(
				process.cwd(),
				`./${localBaseline}/${path.split('/').pop()}/${fileName.replace(examplePage, examplePageFail)}`,
			),
		);
		await copy(
			normalize(`${path}/${fileName}`),
			join(
				process.cwd(),
				`./${localBaseline}/${ checkBaseline }/${path.split('/').pop()}/${fileName.replace(examplePage, 'screenCheckFolders')}`,
			),
		);
	});

	it('should save the compare element screenshot', async () => {
		const {fileName, path} = await browser.imageComparison.saveElement(firstButton, 'firstButtonElement');

		await copy(
			normalize(`${path}/${fileName}`),
			join(
				process.cwd(),
				`./${localBaseline}/${path.split('/').pop()}/${fileName}`,
			),
		);
		await copy(
			normalize(`${path}/${fileName}`),
			join(
				process.cwd(),
				`./${localBaseline}/${ checkBaseline }/${path.split('/').pop()}/${ fileName.replace('firstButtonElement', 'elementCheckFolders') }`,
			),
		);
	});

	it('should save the compare fullpage screenshots', async () => {
		const {fileName, path} = await browser.imageComparison.saveFullPageScreen('fullPage', {fullPageScrollTimeout: '1500'});

		await copy(
			normalize(`${path}/${fileName}`),
			join(
				process.cwd(),
				`./${localBaseline}/${path.split('/').pop()}/${fileName}`,
			),
		);
		await copy(
			normalize(`${path}/${fileName}`),
			join(
				process.cwd(),
				`./${localBaseline}/${ checkBaseline }/${path.split('/').pop()}/${ fileName.replace('fullPage', 'fullPageCheckFolders') }`,
			),
		);
	});
});
