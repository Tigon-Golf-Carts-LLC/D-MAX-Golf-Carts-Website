# Static deployment

D-MAX Golf Carts is a frontend-only React/Vite site. It produces static HTML, JavaScript, CSS, images, documents, feeds, and SEO files in `dist/public`.

## Recommended: Cloudflare Worker

This repository includes `wrangler.jsonc` and `src/worker.ts`. Cloudflare serves the built files as Worker Static Assets and falls back to `index.html` for routes such as `/models/xt4`.

From `artifacts/dmax-golf-carts`:

```sh
pnpm install
pnpm run build:static
npx wrangler login
npx wrangler deploy
```

The Worker name is `dmax-golf-carts`. Attach `dmaxgolfcarts.com` to it from the Cloudflare dashboard under Workers & Pages → the Worker → Settings → Domains & Routes.

## GitHub Pages

The included `.github/workflows/deploy-dmax-golf-carts-pages.yml` builds and publishes `dist/public` on pushes to `main`. Set **GitHub Actions** as the Pages source in the repository settings.

The workflow builds with the repository name as the asset base, which is correct for a project Pages URL such as `username.github.io/repository-name`. For a custom domain or a user/organization Pages site, update the workflow's `BASE_PATH` value to `/`.

The build creates `404.html` as a GitHub Pages SPA fallback, so direct navigation to model pages continues to work.

## Local static preview

```sh
pnpm run build:static
pnpm run serve
```

There is no database, API server, authentication service, or runtime environment variable required by the website.