const path = require('path');
const { DefinePlugin } = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const devPlugins = [
  // add development-only plugins heres
];

const prodPlugins = [
  // plugins for production environment
];

const plugins = [
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  ...(isProduction ? prodPlugins : devPlugins)
];

module.exports = {
  context: path.resolve(__dirname, './'),
  entry: {
    customJS: './js/main.js',
  },
  output: {
    path: path.resolve(__dirname, './js'),
    filename: 'custom.js'
  },
  devtool: isProduction ? undefined : 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      // exclude: /node_modules\/(?!(rss\-parser)\/).*/,
      loader: 'babel-loader',
    }],
  },
  plugins
};
