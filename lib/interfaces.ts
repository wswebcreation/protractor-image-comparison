export interface InstanceData {
  browserName?: string;
  browserVersion?: string;
  logName?: string;
  platformName?: string;
  deviceName?: string;
  nativeWebScreenshot?: boolean;
}

export interface BaseMethodOptions {
  hideElements?: HTMLElement[];
  removeElements?: HTMLElement[];
  hideAfterFirstScroll?: HTMLElement[];
}
