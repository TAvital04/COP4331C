import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["colors/js/md5.js", "node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["colors/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.node,
        md5: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(doLogin|saveCookie|readCookie|doLogout|addColor|searchColor)$" }]
    }
  },
  {
    files: ["**/*.test.js", "tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      }
    }
  }
];


