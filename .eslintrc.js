/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@anton.bobrov/eslint-config'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
};
