const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    blockList: [
      /android\/.*/,
      /ios\/.*/,
      /\.gradle\/.*/,
      /node_modules\/.*\/android\/build\/.*/,
      /node_modules\/.*\/ios\/build\/.*/,
    ],
  },
};

module.exports = withStorybook(mergeConfig(defaultConfig, config), {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: './.storybook',
});
