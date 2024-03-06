const { merge } = require('webpack-merge');
const { PATHS } = require('../PATHS');

const baseWebpackConfig = require('./webpack.base');

/** @type {import('webpack').Configuration} */
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'source-map',

  devServer: {
    open: true,
    static: {
      directory: PATHS.public,
    },
    compress: true,
    port: 3000,
  },
});
