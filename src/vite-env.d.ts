/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  // Add any other environment variables you need here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
