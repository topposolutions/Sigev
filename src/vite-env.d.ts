/// <reference types="vite/client" />

declare global {
  interface String {
    formatUnicorn(...args: any[]): string;
  }
}

export {};

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
