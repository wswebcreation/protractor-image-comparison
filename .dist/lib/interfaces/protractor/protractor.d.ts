import { ImageComparisonClient } from '../ImageComparisonClient';
import { BaseImageComparisonClient } from '../base.client';
import { InstanceData } from "../InstanceData";
export default class ProtractorClient extends BaseImageComparisonClient implements ImageComparisonClient {
    executeClientScript<T>(script: Function | string, ...scriptArgs: any[]): Promise<T>;
    getInstanceData(): Promise<InstanceData>;
    takeScreenshot(): Promise<string>;
}
