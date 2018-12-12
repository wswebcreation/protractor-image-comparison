/**
 * Get the current height of the iOS status and address bar
 *
 * @param {object} iosOffsets                                  The iOS offsets, see the constants
 * @param {object} iosOffsets.{number}                         The iOS offsets for a specific iOS version
 * @param {number} iosOffsets.{number}.STATUS_BAR              The height of the status bar
 * @param {number} iosOffsets.{number}.STATUS_BAR_PRO          The height of the status bar for an iPad Pro
 * @param {number} iosOffsets.{number}.STATUS_BAR_X            The height of the status bar for an iPhone X#
 * @param {number} iosOffsets.{number}.ADDRESS_BAR             The height of the address bar
 * @param {object} iosOffsets.{number}.HOME_BAR                The home bar data
 * @param {object} iosOffsets.{number}.HOME_BAR.DEFAULT        The default home bar data
 * @param {number} iosOffsets.{number}.HOME_BAR.DEFAULT.height The height of the home bar
 * @param {number} iosOffsets.{number}.HOME_BAR.DEFAULT.width  The width of the home bar
 * @param {number} iosOffsets.{number}.HOME_BAR.DEFAULT.x      The x position of the home bar
 * @param {number} iosOffsets.{number}.HOME_BAR.DEFAULT.y      The y position of the home bar
 * @param {object} iosOffsets.{number}.HOME_BAR.LARGE          The large home bar data
 * @param {number} iosOffsets.{number}.HOME_BAR.LARGE.height   The height of the home bar
 * @param {number} iosOffsets.{number}.HOME_BAR.LARGE.width    The width of the home bar
 * @param {number} iosOffsets.{number}.HOME_BAR.LARGE.x        The x position of the home bar
 * @param {number} iosOffsets.{number}.HOME_BAR.LARGE.y        The y position of the home bar
 *
 * @returns {{
 * 		statusAddressBar:{
 *   		height:number,
 *   		width:number,
 *   		x:number,
 *   		y:number,
 * 		},
 * 		toolBar:{
 *   		height:number,
 *   		width:number,
 *   		x:number,
 *   		y:number,
 * 		},
 * }}
 */
export function getIosStatusAddressToolBarHeight(iosOffsets) {
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

	const statusAddressBarHeight = statusBarHeight + versionOffsets.ADDRESS_BAR;
	const toolBarHeight = height - innerHeight - statusAddressBarHeight;
	const toolBar = {
		height: toolBarHeight,
		width,
		x: 0,
		y: height - toolBarHeight,
	};

	// The status and address can be smaller due to a "manual" scroll meaning there is no toolbar
	if (toolBar.height < 0) {
		toolBar.height = 0;
		toolBar.y = 0;
	}
	// Add the handlebar on iPhone X series as a blockout, it can colour with the background
	if (toolBar.height === 0 && isIphoneXSeries){
		// Needs to be verbose to support the correct injection
		toolBar.height = versionOffsets.HOME_BAR.DEFAULT.height;
		toolBar.width = versionOffsets.HOME_BAR.DEFAULT.width;
		toolBar.x = versionOffsets.HOME_BAR.DEFAULT.x;
		toolBar.y = versionOffsets.HOME_BAR.DEFAULT.y;

		// For the XS Max
		if ((width === 896 || height === 896)) {
			// Needs to be verbose to support the correct injection
			toolBar.height = versionOffsets.HOME_BAR.LARGE.height;
			toolBar.width = versionOffsets.HOME_BAR.LARGE.width;
			toolBar.x = versionOffsets.HOME_BAR.LARGE.x;
			toolBar.y = versionOffsets.HOME_BAR.LARGE.y;
		}
	}

	// Determine status, address and tool bar height and width
	return {
		statusAddressBar: {
			height: statusAddressBarHeight,
			width,
			x: 0,
			y: 0,
		},
		toolBar,
	};
}