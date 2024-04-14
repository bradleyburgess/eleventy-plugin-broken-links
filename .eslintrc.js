module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": ["error"],
    "no-unused-vars": "warn",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
};
