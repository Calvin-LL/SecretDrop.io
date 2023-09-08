import path from "node:path";

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["./tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    allowOnly: !process.env.CI,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
