const js = require("@eslint/js");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  js.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly",
        localStorage: "readonly",
        Math: "readonly",
        alert: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Number: "readonly",
        location: "readonly",
      },
      ecmaVersion: 2022,
      sourceType: "script",
    },
  },
  prettierConfig,
];
