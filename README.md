# D-MAX Golf Carts

Static marketing website for D-MAX Golf Carts, built with React, Vite and
Tailwind, and deployed to Cloudflare Workers as static assets.

## Quick start

```sh
pnpm install
pnpm --filter @workspace/dmax-golf-carts run dev
```

## Common commands

Run these from the repository root:

| Command | What it does |
| --- | --- |
| `pnpm run build:site` | Production build into `artifacts/dmax-golf-carts/dist/public` |
| `pnpm run preview:site` | Build, then serve it through Wrangler exactly as Cloudflare will |
| `pnpm run deploy:site` | Build, then deploy to Cloudflare Workers |
| `pnpm run typecheck` | Typecheck every package in the workspace |

## Deployment

See [`artifacts/dmax-golf-carts/DEPLOYMENT.md`](artifacts/dmax-golf-carts/DEPLOYMENT.md)
for Cloudflare setup, custom domains, CI, and the header policy.

## Repository layout

This is a pnpm workspace. The website lives in `artifacts/dmax-golf-carts`;
`artifacts/api-server`, `artifacts/mockup-sandbox` and `lib/*` are scaffolding
that the website does not depend on at runtime.
