/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GRAPHQL_URL: string;
    readonly VITE_API_KEY: string;
    readonly VITE_MULTIPLE_LANGUAGE_SUPPORT: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
