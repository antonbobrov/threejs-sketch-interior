const path = require('path');

const PATHS = {
  root: path.resolve(__dirname, '..'),
  build: path.resolve(__dirname, '../build'),
  public: path.resolve(__dirname, '../public'),
  src: path.resolve(__dirname, '../src'),
  pages: path.resolve(__dirname, '../src/pages'),
};

module.exports = { PATHS };
