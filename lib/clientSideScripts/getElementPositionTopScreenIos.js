/**
 * Get the element position to the top of the screen of the device, not the top of the webview
 *
 * @returns {{
 * 		height: number,
 *    width: number,
 *    x: number,
 *    y: number
 * }}
 */

export function getElementPositionTopScreenIos(offsets, element) {
	// Determine version for the right offsets
	const match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
	const majorVersion = parseInt(match[ 1 ], 10);
	const versionOffsets = offsets[ majorVersion ];

	// Determine screen widht/height to determine iPhone X series address bar height
	const { width, height } = window.screen;
	const isIphoneXSeries = (width === 812 || height === 812) || (width === 896 || height === 896);

	// Determine if iPad Pro with no touchID for higher status bar
	const { innerWidth, innerHeight } = window;
	const isIpadNoTouch = (
		(innerHeight + versionOffsets.ADDRESS_BAR + versionOffsets.STATUS_BAR_PRO) === height ||
		(innerWidth + versionOffsets.ADDRESS_BAR + versionOffsets.STATUS_BAR_PRO) === width
	);

	// Determine address bar height
	let statusBarHeight;
	if (isIphoneXSeries) {
		statusBarHeight = versionOffsets.STATUS_BAR_X;
	} else if (isIpadNoTouch) {
		statusBarHeight = versionOffsets.STATUS_BAR_PRO;
	} else {
		statusBarHeight = versionOffsets.STATUS_BAR;
	}

	// Determine status and addressbar height
	const statusBarAddressBarHeight = statusBarHeight + versionOffsets.ADDRESS_BAR;

	// Determine element position
	const elementPosition = element.getBoundingClientRect();
	let y;

	if (height === innerHeight || width === innerHeight) {
		/* an app with a transparent statusbar */
		y = elementPosition.top;
	} else {
		/* safari */
		y = statusBarAddressBarHeight + elementPosition.top;
	}

	return {
		height: elementPosition.height,
		width: elementPosition.width,
		x: elementPosition.left,
		y: y
	};
}