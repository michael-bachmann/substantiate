// Ambient typing for the one build-time env var this package reads directly
// (`web3forms.ts`). Declared here so the shared source typechecks in its own
// context — and merges cleanly with an app's env typings (Vite's `vite/client`
// or wxt's generated globals) when that app's tsc compiles this source.
interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
