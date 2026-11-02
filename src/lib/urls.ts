export function withBase(path: string, base: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;

  const prefix = base.replace(/\/+$/, "");
  if (!prefix || path === prefix || path.startsWith(`${prefix}/`)) return path;

  return `${prefix}${path}`;
}
