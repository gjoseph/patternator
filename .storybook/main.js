module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
  ],
  typescript: {
    check: true, // type-check stories during Storybook build
  },
  webpackFinal: (config) => {
    config.resolve.alias = {
      // Swap snapsvg-cjs for snapsvg to account for webpack compatilibity (the imports-loader hacks didn't work for me)
      // https://github.com/adobe-webplatform/Snap.svg/issues/341
      snapsvg: "snapsvg-cjs",
    };
    return config;
  },
  // https://github.com/storybookjs/storybook/issues/13834
  babel: async (options) => ({
    ...options,
    plugins: ["@babel/plugin-transform-typescript", ...options.plugins],
  }),
};
