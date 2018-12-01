/**
 * Get the current height of the iOS status and address bar
 *
 * @param {object} iosOffsets                      The iOS offsets, see the constants
 * @param {object} iosOffsets.{number}             The iOS offsets for a specific iOS version
 * @param {number} iosOffsets.{number}.STATUS_BAR  The height of the status bar
 * @param {number} iosOffsets.{number}.ADDRESS_BAR The height of the address bar
 * @param {number} iosOffsets.{number}.TOOL_BAR    The height of the tool bar
 *
 * @returns {number}
 */
export function determineIosStatusAddressBarHeight(iosOffsets) {
	// Determine version for the right offsets
	const match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
	const majorVersion = parseInt(match[ 1 ], 10);
	const versionOffsets = iosOffsets[ majorVersion ];

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

	// Determine status and address bar height
	return statusBarHeight + versionOffsets.ADDRESS_BAR;
}