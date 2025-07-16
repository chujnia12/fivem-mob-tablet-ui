
declare global {
  interface Window {
    invokeNative?: any;
  }
  
  function GetParentResourceName(): string;
  function fetch(url: string, options?: any): Promise<any>;
}

export {};
