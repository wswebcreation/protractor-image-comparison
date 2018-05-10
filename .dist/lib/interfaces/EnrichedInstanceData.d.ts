import { InstanceData } from "./InstanceData";
export interface EnrichedInstanceData extends InstanceData {
    addressBarShadowPadding: number;
    isAndroid: boolean;
    isIos: boolean;
    isMobile: boolean;
    isNativeWebScreenshot: boolean;
    testInBrowser: boolean;
    testInMobileBrowser: boolean;
    toolBarShadowPadding: number;
}
