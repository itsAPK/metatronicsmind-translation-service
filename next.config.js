/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import a from 'next-remove-imports'
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
 experimental : {
instrumentationHook : true
 },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle binary files
    config.module.rules.push({
      test: /\.(bin|node)$/i,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    });

    // Important: return the modified config
    return config;
  },

};

const removeImports = a({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: "\\.(less|css|scss|sass|styl)$"
});

export default removeImports((config));
