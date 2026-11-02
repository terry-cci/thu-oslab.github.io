import { withBase } from "./urls";

export const LANGUAGES = ["en", "zh"] as const;

const sectionPaths = {
  home: "",
  research: "research/",
  publications: "publications/",
  people: "people/",
  join: "join/",
  "yu-chen": "people/yu-chen/",
  "yong-xiang": "people/yong-xiang/",
} as const;

export type Language = (typeof LANGUAGES)[number];
export type Section = keyof typeof sectionPaths;

export const SECTIONS = Object.keys(sectionPaths) as Section[];

export function languageTag(lang: Language): string {
  return lang === "zh" ? "zh-CN" : "en";
}

export function navigationSection(section: Section): Section {
  return sectionPaths[section].startsWith("people/") ? "people" : section;
}

export function pagePath(lang: Language, section: Section): string {
  return `${lang === "zh" ? "/zh/" : "/"}${sectionPaths[section]}`;
}
export function pageUrl(lang: Language, section: Section): string {
  return withBase(pagePath(lang, section), import.meta.env.BASE_URL);
}
