// @fontsource-variable/* ships CSS only (no type declarations). TypeScript 6.0
// errors on side-effect imports of untyped modules (TS2882), so declare the
// scope as ambient CSS-only modules for the `import "@fontsource-variable/…"`
// lines in the entrypoints.
declare module "@fontsource-variable/*";
