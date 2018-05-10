import { InstanceData } from "./InstanceData";
export interface ImageComparisonClient {
    executeClientScript<T>(script: Function | string, ...scriptArgs: any[]): Promise<T>;
    getInstanceData(): Promise<InstanceData>;
    takeScreenshot(): Promise<string>;
}
