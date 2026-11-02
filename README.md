# THU-OSLAB

The bilingual website for the Operating Systems Lab, Department of Computer Science and Technology, Tsinghua University. Built with Astro for static hosting at [thu-oslab.github.io](https://thu-oslab.github.io/).

The site includes Home, Research, Publications, People, Join us, and faculty profiles for Yu Chen and Yong Xiang. English pages use root URLs; Chinese pages use `/zh/`. The language switch preserves the current page.

## Development

Use Node.js 24 and pnpm 12.16.1. The package manager version and minimum Node.js version are declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm format        # Format source, content, and configuration
pnpm format:check  # Check formatting without changing files
pnpm check         # Check Astro and TypeScript types
pnpm build         # Generate the static site in dist/
pnpm preview       # Preview the production build
```

Prettier formats Astro, CSS, TypeScript, Markdown, JSON, and YAML. Generated files and the pnpm lockfile are excluded from formatting. Run the formatting check, type check, and build before submitting changes.

When a new content page returns 404 during development, restart `pnpm dev` to refresh the content and route caches.

## Project structure

| Location                                         | Purpose                                       |
| ------------------------------------------------ | --------------------------------------------- |
| `src/pages/[...path].astro`                      | Route generation and page rendering           |
| `src/layouts/SiteLayout.astro`                   | Document metadata and shared page layout      |
| `src/components/SiteHeader.astro`                | Lab identity, language switch, and navigation |
| `src/components/FacultyContact.astro`            | Yu Chen's contact block                       |
| `src/components/Publications.astro`              | Publication list grouped by year              |
| `src/lib/routes.ts`                              | Route paths, sections, and language helpers   |
| `src/lib/urls.ts`                                | Deployment base path handling                 |
| `src/lib/markdown-base.ts`                       | Base paths for Markdown links and images      |
| `src/content.config.ts`                          | Page and publication schemas                  |
| `src/content/pages/en/`, `src/content/pages/zh/` | Page text in each language                    |
| `src/content/publications/`                      | Publication records shared across languages   |
| `src/data/lab.json`                              | Lab identity and affiliation                  |
| `src/data/yu-chen.json`                          | Yu Chen's position and contact details        |
| `src/styles/global.css`                          | Colour variables and shared base styles       |
| `.pages.yml`                                     | Pages CMS forms                               |
| `public/media/`                                  | Uploaded media, served at `/media/`           |
| `.github/workflows/deploy.yml`                   | Validation and GitHub Pages deployment        |

Navigation labels and ordering are defined in `SiteHeader.astro`. The content schema derives its allowed sections from the route map in `src/lib/routes.ts`. Component and layout styles live in scoped `<style>` blocks; shared colour variables and base styles live in `global.css`.

## Editing content

### Pages

Edit English and Chinese Markdown separately in `src/content/pages/en/` and `src/content/pages/zh/`. Each page has a `title`, `lang`, and `section` in its frontmatter. Lab pages describe the group; individual biographies and contact details belong in faculty profiles.

Each homepage introduces the lab, outlines its research areas, highlights selected recent work, and links to recruitment information. Maintain the recent-work selections in both homepage `index.md` files; their links point to the corresponding years in the full publication lists.

To add a page, add its section and path to `src/lib/routes.ts`, create its English and Chinese Markdown files, and add matching forms to `.pages.yml`. Update the navigation in `SiteHeader.astro` if the page needs a main navigation link.

### Faculty profiles

Yu Chen's profiles are at `/people/yu-chen/` and `/zh/people/yu-chen/`. Edit the biography in each language's `yu-chen.md` and the shared position and contact details in `src/data/yu-chen.json`. The page renderer supplies the main heading and contact block, so the Markdown body starts with a second-level heading.

Yong Xiang's profiles are at `/people/yong-xiang/` and `/zh/people/yong-xiang/`. Their headings, research interests, and contact details are maintained in each language's `yong-xiang.md`.

Update the summaries in both `people.md` files when faculty details change.

### Publications

Each Markdown file in `src/content/publications/` contains one publication's frontmatter. The same record appears in both languages.

| Field      | Requirement                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| `title`    | Paper title; nonblank text                                                    |
| `authors`  | Authors in publication order; nonblank text                                   |
| `venue`    | Venue and year, such as `SOSP 2024`; nonblank text                            |
| `year`     | Publication year as an integer                                                |
| `order`    | Optional integer, defaulting to `0`; lower numbers appear first within a year |
| `paperUrl` | Optional paper link                                                           |
| `codeUrl`  | Optional code link                                                            |

Publications are grouped by descending year, then sorted by `order` and file ID. Optional URLs are trimmed, and blank values are treated as omitted. Provided URLs must pass validation. Paper and code links appear after the venue.

### Pages CMS

Open [Pages CMS](https://app.pagescms.org/), sign in, and connect its GitHub App to the repository. Select the repository to use the forms defined in `.pages.yml`.

The configuration provides forms for every page in both languages, shared publication records, lab identity, and Yu Chen's contact details. Page forms hide `lang` and `section` to preserve routing. Use **Publications · shared across languages** to add or edit a paper.

Media uploaded through the CMS is stored in `public/media/`. Keep content links and media paths relative to the site root, such as `/research/` and `/media/photo.jpg`; the build prefixes them with the deployment base path when needed.

## GitHub Pages

`astro.config.mjs` generates static output with trailing slashes. In GitHub Actions, it derives the site origin and base path from `GITHUB_REPOSITORY`:

| Repository                              | Published URL                                              |
| --------------------------------------- | ---------------------------------------------------------- |
| `thu-oslab/thu-oslab.github.io`         | `https://thu-oslab.github.io/`                             |
| `terry-cci/thu-oslab.github.io-preview` | `https://terry-cci.github.io/thu-oslab.github.io-preview/` |

Enable **Settings → Pages → Source → GitHub Actions** in the repository being deployed.

The workflow checks formatting and types and builds the site for pull requests targeting `main`. Pushes to `main` and manual runs on `main` also upload `dist/` and deploy it to GitHub Pages. Deployment actions are pinned to release commits.

Local development defaults to the production URL and root base path. To test the personal repository's configuration locally:

```sh
GITHUB_REPOSITORY=terry-cci/thu-oslab.github.io-preview pnpm build
GITHUB_REPOSITORY=terry-cci/thu-oslab.github.io-preview pnpm preview
```

Open `http://localhost:4321/thu-oslab.github.io-preview/` when the preview server starts. Use the matching `GITHUB_REPOSITORY` value for both commands.

For a custom hosting configuration, set `SITE_URL` and `BASE_PATH` as repository variables under **Settings → Secrets and variables → Actions → Variables**, or supply them as shell environment variables locally. For example, `SITE_URL=https://example.com BASE_PATH=/` selects a custom domain at its root. Navigation, language links, canonical URLs, and rendered Markdown links use the configured base automatically.

## Dependency maintenance

```sh
pnpm outdated --include-github-actions
pnpm audit
```

Commit `package.json` and `pnpm-lock.yaml` together when updating dependencies. Run `pnpm format:check`, `pnpm check`, and `pnpm build` after an update. TypeScript is pinned to version 6 for compatibility with the installed Astro checker.
