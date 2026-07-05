import type { StorybookConfig } from '@storybook/react-native';

const config: StorybookConfig = {
  stories: ['../storybook/stories/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
};

export default config;
