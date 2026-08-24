# Deploying D-MAX Golf Carts

The site is a frontend-only React/Vite app. `pnpm run build:static` emits
everything Cloudflare needs — HTML, JS, CSS, images, brochures, feeds and SEO
files — into `dist/public`. There is no database, API server, authentication
service, or runtime environment variable.

## Cloudflare Workers (recommended)

`wrangler.jsonc` configures a **static-assets Worker**: Cloudflare's asset layer
serves every request directly, with no Worker script in front of it. Unknown
paths such as `/models/xt4` return `index.html` so the client router can render
them, and `public/_headers` supplies caching and security headers.

### One-time setup

```sh
pnpm install
pnpm --filter @workspace/dmax-golf-carts exec wrangler login
```

### Deploy

From the repository root:

```sh
pnpm run deploy:site
```

Or from `artifacts/dmax-golf-carts`:

```sh
pnpm run deploy
```

Either command builds first and then uploads `dist/public`. The Worker is named
`dmax-golf-carts` and is reachable at `dmax-golf-carts.<subdomain>.workers.dev`
once deployed.

### Attaching dmaxgolfcarts.com

In the Cloudflare dashboard: **Workers & Pages → dmax-golf-carts → Settings →
Domains & Routes → Add → Custom domain**. Add both `dmaxgolfcarts.com` and
`www.dmaxgolfcarts.com`; Cloudflare provisions the certificate and DNS records.
The domain must already be on the same Cloudflare account.

Note that `index.html`, the sitemaps and the structured data all hard-code
`https://dmaxgolfcarts.com/`, so serve the canonical host from the apex domain
and redirect `www` to it with a Cloudflare bulk redirect.

### Deploying from Git instead of a laptop

**Workers Builds** (dashboard → Workers & Pages → the Worker → Settings →
Build): connect this repository and use

| Field | Value |
| --- | --- |
| Root directory | `/` (repository root — this is a pnpm workspace) |
| Build command | `pnpm run build:site` |
| Deploy command | `pnpm --filter @workspace/dmax-golf-carts exec wrangler deploy` |

The root directory must stay at the repository root so pnpm can resolve the
workspace. `.nvmrc` pins Node 22 and `packageManager` in the root
`package.json` pins pnpm, so the build image matches local builds.

**GitHub Actions** is wired up as an alternative in
`.github/workflows/deploy-cloudflare.yml`. It typechecks, builds and deploys on
every push to `main`. Add two repository secrets under **Settings → Secrets and
variables → Actions**:

- `CLOUDFLARE_API_TOKEN` — an API token with the *Edit Cloudflare Workers*
  template
- `CLOUDFLARE_ACCOUNT_ID` — from the Cloudflare dashboard sidebar

Use one path or the other, not both, or two systems will race to deploy.

## Local preview

Preview exactly what Cloudflare will serve, including `_headers` rules and the
SPA fallback:

```sh
pnpm run preview:cloudflare
```

For a plain Vite preview without the Cloudflare layer, use `pnpm run serve`.

## GitHub Pages (optional alternative)

`pnpm run build:github` produces the same static output plus a `404.html` SPA
fallback, which is how GitHub Pages handles client-side routes. No workflow is
committed for this path — deploying to Pages means publishing `dist/public`
yourself or adding a workflow.

`BASE_PATH=/` is correct for a custom domain or a user/organization Pages site.
For a project URL such as `username.github.io/repository-name`, set
`BASE_PATH=/<repository-name>/` at build time.

## Headers worth reviewing before launch

`public/_headers` deliberately leaves two things off, because both are easy to
get wrong and hard to undo:

- **HSTS** (`Strict-Transport-Security`) — enable it from the Cloudflare
  dashboard (SSL/TLS → Edge Certificates) once you are certain every subdomain
  serves HTTPS.
- **Content-Security-Policy** — the page loads Google Fonts and uses inline
  `application/ld+json` blocks, so a policy needs to allowlist those before it
  can be turned on without breaking the site.
