const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');

const baseWebpackConfig = require('./webpack.base');

/** @type {import('webpack').Configuration} */
module.exports = merge(baseWebpackConfig, {
  mode: 'production',

  optimization: {
    minimize: true,
    minimizer: ['...', new CssMinimizerPlugin()],
  },
});
