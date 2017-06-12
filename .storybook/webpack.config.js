// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/docs/react-storybook/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
// module.exports = {
//   plugins: [
//     // your custom plugins
//   ],
//   module: {
//     loaders: [
//       // add your custom loaders.
//     ],
//   },
// };

const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  storybookBaseConfig.module.rules.push({
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader'],
    include: path.resolve(__dirname, '../'),
  });

  // Return the altered config
  return storybookBaseConfig;
};
