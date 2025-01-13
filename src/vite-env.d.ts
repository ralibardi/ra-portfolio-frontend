/// <reference types="vite/client" />

// Add any custom type declarations here
interface IImportMetaEnv {
  // Define your environment variables here
  readonly VITE_APP_TITLE: string;
  // Add more as needed
}

interface IImportMetaEnv {
  readonly env: ImportMetaEnv;
}
