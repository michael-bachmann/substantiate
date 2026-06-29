<div align="center">

<img src="packages/ui/src/mark.svg" alt="substantiate" width="96">

<h1>substantiate</h1>

**A browser extension + companion site, built as a pnpm monorepo.**

[![CI](https://github.com/michael-bachmann/substantiate/actions/workflows/ci.yml/badge.svg)](https://github.com/michael-bachmann/substantiate/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/michael-bachmann/substantiate/branch/main/graph/badge.svg)](https://codecov.io/gh/michael-bachmann/substantiate)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-MV3-4285F4?logo=googlechrome&logoColor=white)](https://substantiate.dev)
[![Firefox](https://img.shields.io/badge/Firefox-MV2-FF7139?logo=firefoxbrowser&logoColor=white)](https://substantiate.dev)
[![WXT](https://img.shields.io/badge/built%20with-WXT-67d75e)](https://wxt.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

[**Website**](https://substantiate.dev) · [Privacy](https://substantiate.dev/privacy) · [Report an issue](https://github.com/michael-bachmann/substantiate/issues/new)

</div>

---

> **Scaffolding only.** This repo currently holds the monorepo structure, shared
> tooling, and CI/CD. The actual feature implementation lands on top of this.

## Repository layout

pnpm workspace (`apps/*`, `packages/*`):

```
.
├── apps/
│   ├── extension/         # WXT MV3 extension (Chrome + Firefox)
│   │   ├── entrypoints/   # side panel UI, background service worker
│   │   ├── components/    # extension-specific React UI
│   │   ├── lib/           # domain code (pure, unit-tested)
│   │   └── wxt.config.ts  # manifest config (permissions, icons)
│   └── landing/           # substantiate.dev marketing + privacy site (Vite + React),
│                          # deployed to Cloudflare via wrangler
└── packages/
    └── ui/                # @substantiate/ui — shared design tokens + React primitives
```

Commands run per-package via `pnpm --filter <extension|landing> <script>`.

## Tech stack

- **[WXT](https://wxt.dev/)** — MV3 extension framework; one codebase builds for Chrome + Firefox
- **React 19** + **Tailwind 4** for the UI
- **TypeScript 5.9** in strict mode
- **[remeda](https://remedajs.com/)** for typed utility helpers
- **vitest** for tests, colocated as `*.test.ts` next to source under `lib/`
- **[Storybook](https://storybook.js.org/)** for the shared `@substantiate/ui` primitives
- **[Cloudflare](https://workers.cloudflare.com/)** static-asset hosting for the landing site (wrangler)

## Quick start

```bash
pnpm install                         # once

pnpm --filter extension dev          # Chrome → apps/extension/.output/chrome-mv3/
pnpm --filter extension dev:firefox  # Firefox → apps/extension/.output/firefox-mv2/

pnpm --filter landing dev            # landing site dev server
```

Then in `chrome://extensions`: enable **Developer mode** → **Load unpacked** →
pick `apps/extension/.output/chrome-mv3/`.

Production build (store packaging):

```bash
pnpm --filter extension build
pnpm --filter extension zip          # store-ready zip
```

## Tests & checks

```bash
pnpm --filter extension test:run       # vitest — lib/
pnpm --filter extension test:coverage  # vitest + v8 coverage (CI gate)
pnpm --filter extension compile        # tsc --noEmit
pnpm --filter landing compile          # tsc --noEmit
pnpm --filter landing build            # vite build → apps/landing/dist
```

Storybook for the shared UI:

```bash
pnpm --filter extension storybook      # http://localhost:6006
pnpm --filter landing storybook        # http://localhost:6007
```

## Deploy the landing site

The static site is served from Cloudflare via wrangler. CI deploys it on merge to
`main` (`.github/workflows/deploy-landing.yml`) whenever `apps/landing/**`,
`packages/ui/**`, or the lockfile changes — provided `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` are set as repo secrets. Manual deploy:

```bash
pnpm --filter landing build
pnpm --filter landing exec wrangler login
pnpm --filter landing deploy
```

Then attach the custom domain (`substantiate.dev`) in the Cloudflare dashboard.

## CI/CD

- **CI** (`.github/workflows/ci.yml`) — `dorny/paths-filter` runs only the jobs
  whose paths changed. The **extension** job typechecks, runs unit tests +
  coverage (uploaded to Codecov), and builds the store zip. The **landing** job
  typechecks and builds.
- **Deploy** (`.github/workflows/deploy-landing.yml`) — deploys the landing site
  to Cloudflare on merge to `main`.
- **dependabot** (`.github/dependabot.yml`) — weekly npm (workspace-wide) +
  github-actions bumps, minor/patch batched.

## Conventions

- **Tests** — colocate with the code (`foo.ts` ↔ `foo.test.ts`). Behavioral
  tests over implementation tests. Coverage is scoped to domain logic in `lib/`.
- **Functional style** — prefer pure helpers and remeda over mutation.
- **Design tokens** — live once in `@substantiate/ui` (`styles/theme.css`); both
  apps render from that single source of truth.
- **Comments** — describe *why*, not what.

## License

[MIT](LICENSE) © 2026 Michael Bachmann
