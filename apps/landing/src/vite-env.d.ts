/// <reference types="vite/client" />

// SVGs imported with the `?react` query (vite-plugin-svgr) become React
// components. Declared here so type-checking the shared <Logo> (which imports
// mark.svg?react) resolves from this app too.
declare module "*.svg?react" {
  import type { FunctionComponent, SVGProps } from "react";
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// @fontsource-variable/* ships CSS only (no type declarations). TypeScript 6.0
// errors on side-effect imports of untyped modules (TS2882), so declare the
// scope as ambient CSS-only modules for the `import "@fontsource-variable/…"`
// lines in the entrypoints.
declare module "@fontsource-variable/*";
