// src/global.d.ts
declare global {
    interface Window {
      prefillConfigs?: Record<string, any>;
    }
  }
  
  export {};