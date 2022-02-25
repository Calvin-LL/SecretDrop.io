module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:import/typescript",
  ],
  plugins: ["import"],
  rules: {
    "vue/html-self-closing": "off",
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/require-default-prop": "off",

    "no-undef": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "sort-imports": [
      "warn",
      {
        ignoreDeclarationSort: true,
        allowSeparatedGroups: true,
      },
    ],

    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-module-boundary-types": "warn",

    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type",
        ],
        "newlines-between": "always",
        alphabetize: { order: "desc", caseInsensitive: false },
      },
    ],
  },
};
