import { satteri } from "@astrojs/markdown-satteri";
import { defineConfig } from "astro/config";
import { markdownBase } from "./src/lib/markdown-base";

const [owner, repository] = (
  process.env.GITHUB_REPOSITORY || "thu-oslab/thu-oslab.github.io"
).split("/");
const base =
  process.env.BASE_PATH ||
  (repository.toLowerCase() === `${owner.toLowerCase()}.github.io`
    ? "/"
    : `/${repository}/`);

export default defineConfig({
  site: process.env.SITE_URL || `https://${owner}.github.io`,
  base,
  output: "static",
  trailingSlash: "always",
  markdown: {
    processor: satteri({ hastPlugins: markdownBase(base) }),
  },
});
