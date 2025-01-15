/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,

  plugins: [
    "prettier-plugin-svelte",
    "prettier-plugin-tailwindcss"
  ],
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte"
      }
    }
  ],
};

export default config;
