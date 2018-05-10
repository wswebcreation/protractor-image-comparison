import { InstanceData } from "./InstanceData";
export declare abstract class BaseImageComparisonClient {
    private addressBarShadowPadding;
    private autoSaveBaseline;
    private baselineFolder;
    private baseFolder;
    private debug;
    private disableCSSAnimation;
    private hideScrollBars;
    private formatString;
    private nativeWebScreenshot;
    private toolBarShadowPadding;
    constructor(options: any);
    abstract executeClientScript<T>(script: Function | string, ...scriptArgs: any[]): Promise<T>;
    abstract getInstanceData(): Promise<InstanceData>;
    abstract takeScreenshot(): Promise<string>;
    saveScreen(tag: string, options?: {
        disableCSSAnimation: boolean;
        hideScrollBars: boolean;
    }): Promise<any>;
}
