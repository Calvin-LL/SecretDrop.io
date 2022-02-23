module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    defineProps: true,
    defineEmits: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",

    "plugin:import/typescript",
  ],
  plugins: ["import"],
  rules: {
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/html-indent": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/html-self-closing": "off",
    "vue/require-default-prop": "off",
    "vue/multi-word-component-names": "off",

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
