import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
      sourceType: "commonjs",
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,

      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": "off",
      "indent": ["error", 2, { SwitchCase: 1 }],
      "semi": ["error", "always"],
      "space-before-blocks": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "space-infix-ops": "error",
      "comma-spacing": ["error", { before: false, after: true }],
      "arrow-spacing": ["error", { before: true, after: true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "eol-last": ["error", "always"],

   
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-var": "error",
      "prefer-const": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "newline-before-return": "error",

     
      "callback-return": "warn",
      "handle-callback-err": "warn",
      "no-path-concat": "error",
    },
  },
]);
