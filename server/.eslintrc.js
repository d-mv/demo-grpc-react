module.exports = {
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "es6": true,
    "jest": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "rules": {
    "no-console": 0,
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  },
}
