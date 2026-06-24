/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module "*.css" {
  const content: string;
  export default content;
}

/** Build id iniettato da Vite (define) per l'auto-update della PWA. */
declare const __BUILD_ID__: string;
