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

export function getElementPositionTopScreenAndroid(offsets, element) {
	// Determine version for the right offsets
	const match = (navigator.appVersion).match(/Android (\d+).(\d+).?(\d+)?/);
	const majorVersion = parseInt(match[ 1 ], 10);
	const versionOffsets = offsets[ majorVersion ];

	// Get some heights and widths
	const { width, height } = window.screen;
	const { innerHeight } = window;

	// Determine status and address bar height
	const statusBarHeight = versionOffsets.STATUS_BAR;
	const statusBarAddressBarHeight = statusBarHeight + versionOffsets.ADDRESS_BAR;

	// Determine element position
	const elementPosition = element.getBoundingClientRect();
	let y;

	if (height === innerHeight || width === innerHeight) {
		/* an app with a transparent statusbar */
		y = elementPosition.top;
	} else {
		y = statusBarAddressBarHeight + elementPosition.top;
	}

	return {
		height: elementPosition.height,
		width: elementPosition.width,
		x: elementPosition.left,
		y: y
	};
}