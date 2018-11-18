import {
	DEFAULT_FORMAT_STRING,
	DEFAULT_RESIZE_DIMENSIONS,
	DEFAULT_SHADOW,
	FULL_PAGE_SCROLL_TIMEOUT,
} from './constants';

export function defaultOptions(options) {
	return {
		autoSaveBaseline: options.autoSaveBaseline || false,
		debug: options.debug || false,
		disableCSSAnimation: options.disableCSSAnimation || false,
		formatString: options.formatImageName || DEFAULT_FORMAT_STRING,
		hideScrollBars: options.hideScrollBars !== false,
		nativeWebScreenshot: !!options.nativeWebScreenshot,
		addressBarShadowPadding: options.addressBarShadowPadding || DEFAULT_SHADOW.ADDRESS_BAR,
		toolBarShadowPadding: options.toolBarShadowPadding || DEFAULT_SHADOW.TOOL_BAR,
		resizeDimensions: options.resizeDimensions || DEFAULT_RESIZE_DIMENSIONS,
		fullPageScrollTimeout: options.fullPageScrollTimeout || FULL_PAGE_SCROLL_TIMEOUT,
		savePerInstance: options.savePerInstance || false,

		// Compare options
		blockOutStatusBar: !!options.blockOutStatusBar,
		ignoreAlpha: options.ignoreAlpha || false,
		ignoreAntialiasing: options.ignoreAntialiasing || false,
		ignoreColors: options.ignoreColors || false,
		ignoreLess: options.ignoreLess || false,
		ignoreNothing: options.ignoreNothing || false,
		ignoreTransparentPixel: options.ignoreTransparentPixel || false,
		saveAboveTolerance: options.saveAboveTolerance || 0,
		rawMisMatchPercentage: options.rawMisMatchPercentage || false,
	}
}
