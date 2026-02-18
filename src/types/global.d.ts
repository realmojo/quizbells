export {};

declare global {
  interface Window {
    googletag: any;
    __rewardedAdEvent: any;
    __pendingNavUrl: string | null;
  }
}
