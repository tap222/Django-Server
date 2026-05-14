# Landing page images

Placeholder SVGs ship with the repo so the landing page renders without broken assets.

Replace these with production artwork when ready:

| File | Usage |
|------|--------|
| `community.svg` | Community section (right column). Prefer JPG/WebP photo ≥960×768. |
| `servers.svg` | Servers section (left column). Prefer JPG/WebP photo ≥960×768. |
| `instructor-1.svg` … `instructor-5.svg` | Instructor portraits. Prefer square or 4×5 crops ≥640×800. |

Keep the same filenames or update paths in `app/config/landing.content.ts`.

After deployment, set `runtimeConfig.public.siteUrl` in environment-specific config for accurate canonical and Open Graph URLs.
