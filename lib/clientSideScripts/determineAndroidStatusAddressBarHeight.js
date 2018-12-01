/**
 * Get the current height of the Android status and address bar
 *
 * @param {object} androidOffsets                      The Android offsets
 * @param {object} androidOffsets.{number}             The Android offsets for a specific Android version
 * @param {object} androidOffsets.{number}             The Android offsets, see the constants
 * @param {number} androidOffsets.{number}.STATUS_BAR  The height of the status bar
 * @param {number} androidOffsets.{number}.ADDRESS_BAR The height of the address bar
 * @param {number} androidOffsets.{number}.TOOL_BAR    The height of the tool bar
 *
 * @returns {number}
 */
export default function determineAndroidStatusAddressBarHeight(androidOffsets) {
	// Determine version for the right offsets
	const match = (navigator.appVersion).match(/Android (\d+).(\d+).?(\d+)?/);
	const majorVersion = parseInt(match[ 1 ], 10);
	const versionOffsets = androidOffsets[ majorVersion ];

	// Determine status and address bar height
	return versionOffsets.STATUS_BAR + versionOffsets.ADDRESS_BAR;
}