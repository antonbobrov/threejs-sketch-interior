const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { PATHS } = require('../PATHS');
const { getFilesPaths } = require('../utils/getFilesPaths');

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/js/index.ts',

  output: {
    path: PATHS.build,
    filename: '[name].[contenthash].js',
    publicPath: '',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        sideEffects: true,
      },

      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        loader: 'raw-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: !isProduction ? '[name].css' : '[name].[fullhash].css',
    }),

    ...getFilesPaths(PATHS.pages, '.html').map(({ path: filePath }) => {
      const filename = filePath.replace(PATHS.pages, '').replace(/^\//, '');

      return new HtmlWebpackPlugin({
        template: filePath,
        filename,
        minify: isProduction,
        inject: 'body',
      });
    }),

    new CopyPlugin({
      patterns: [{ from: PATHS.public, to: '' }],
    }),
  ],
};
