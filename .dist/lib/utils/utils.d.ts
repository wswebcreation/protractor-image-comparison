import { InstanceData } from "../interfaces/InstanceData";
import { EnrichedInstanceData } from "../interfaces/EnrichedInstanceData";
import { EnrichInstanceDataWith } from "../interfaces/EnrichInstanceDataWith";
export declare function platformIsAndroid(platformName: string): boolean;
export declare function platformIsIos(platformName: string): boolean;
export declare function enrichInstanceData(options: EnrichInstanceDataWith, instanceData: InstanceData): EnrichedInstanceData;
