/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_THEME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
