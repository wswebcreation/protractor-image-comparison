import { DEFAULT_FORMAT_STRING, DEFAULT_SHADOW } from "./constants";

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
    resizeDimensions: options.resizeDimensions || 0,

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
