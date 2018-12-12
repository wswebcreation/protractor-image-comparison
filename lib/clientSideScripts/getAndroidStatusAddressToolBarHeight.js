/**
 * Get the current height of the Android status and address bar
 *
 * @param {object} androidOffsets                      The Android offsets
 * @param {object} androidOffsets.{number}             The Android offsets for a specific Android version
 * @param {object} androidOffsets.{number}             The Android offsets, see the constants
 * @param {number} androidOffsets.{number}.STATUS_BAR  The height of the status bar
 * @param {number} androidOffsets.{number}.ADDRESS_BAR The height of the address bar
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
export default function getAndroidStatusAddressToolBarHeight(androidOffsets) {
	// Determine version for the right offsets
	const { height, width } = window.screen;
	const { innerHeight } = window;
	const match = (navigator.appVersion).match(/Android (\d+).(\d+).?(\d+)?/);
	const majorVersion = parseInt(match[ 1 ], 10);
	const versionOffsets = androidOffsets[ majorVersion ];
	const statusAddressBarHeight = versionOffsets.STATUS_BAR + versionOffsets.ADDRESS_BAR;
	const toolBarHeight = height - innerHeight - statusAddressBarHeight;

	// Determine status, address and tool bar height
	return {
		statusAddressBar:{
			height: statusAddressBarHeight,
			width,
			x: 0,
			y:0,
		},
		toolBar: {
			height: toolBarHeight,
			width,
			x: 0,
			y: height - toolBarHeight,
		},
	};
}