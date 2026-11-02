import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import { withBase } from "./urls";

export function markdownBase(
  base: string,
): SatteriProcessorOptions["hastPlugins"] {
  return [
    {
      name: "site-base-urls",
      element: {
        filter: ["a", "img"],
        visit(node, context) {
          for (const attribute of ["href", "src"]) {
            const value = node.properties[attribute];
            if (typeof value === "string") {
              context.setProperty(node, attribute, withBase(value, base));
            }
          }
        },
      },
    },
  ];
}
