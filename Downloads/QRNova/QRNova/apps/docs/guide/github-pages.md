# GitHub Pages

The static QR Studio and this documentation are published to GitHub Pages:

| Site | URL |
| --- | --- |
| QR Studio | <https://kspkr.github.io/QRNova/> |
| Documentation | <https://kspkr.github.io/QRNova/docs/> |

GitHub Pages serves static files only. The hosted Studio generates and exports static codes in the browser, but accounts, dynamic codes, analytics and the API are not available there. They require a [self-hosted QRNova server](./self-hosting).

## How the deployment works

The workflow `.github/workflows/pages.yml` runs on every push to `main`:

1. Installs dependencies with `npm ci`.
2. Builds the web app with `VITE_BASE=/QRNova/` and `VITE_STATIC_ONLY=true`. The base path matches the repository name, and static-only mode removes the server features so the app never calls `/api`.
3. Builds the documentation with `DOCS_BASE=/QRNova/docs/` and places it in the `docs/` directory of the site.
4. Copies `index.html` to `404.html`. GitHub Pages returns `404.html` for unknown paths, which lets the single-page app handle routes such as `/QRNova/studio` on a full page load.
5. Uploads the result with `actions/upload-pages-artifact` and publishes it with `actions/deploy-pages`.

## Enabling it

In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. The next push to `main` deploys the site. Deployments can also be started manually from the **Actions** tab.

## Using it in a fork

1. Fork the repository.
2. Under **Settings → Pages**, set **Source** to **GitHub Actions**.
3. If the fork has a different name, update `VITE_BASE` and `DOCS_BASE` in `.github/workflows/pages.yml` to `/<repository-name>/` and `/<repository-name>/docs/`.
4. Push to `main`.

The site is then available at `https://<user>.github.io/<repository-name>/`. For a custom domain, configure it under **Settings → Pages** and set both base paths to `/` and `/docs/`.

## Building locally

```bash
VITE_BASE=/QRNova/ VITE_STATIC_ONLY=true npm run build
DOCS_BASE=/QRNova/docs/ npm run build:docs
```

The output is written to `apps/web/dist` and `apps/docs/.vitepress/dist`.
