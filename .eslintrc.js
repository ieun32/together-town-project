module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsdoc/recommended",
  ],
  plugins: [],
  parserOptions: {
    ecmaVersion: "es2021",
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
  ignorePatterns: ["dist", "server.js", "src/functions/*.test.js"],
};
