const path = require('path');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

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
  new MiniCssExtractPlugin({
    path: path.resolve(__dirname, './css'),
    filename: 'custom1.css',
  }),
  ...(isProduction ? prodPlugins : devPlugins),
  new FileManagerPlugin({
    onEnd: [
      {copy: [
        {
          source: path.resolve(__dirname, './js/*.css*'),
          destination: path.resolve(__dirname, './css'),
        },
      ]},
      {delete: [
        path.resolve(__dirname, './js/*.css*'),
      ]}
    ]
  })
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
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules\/(?!(my\-package)\/).*/,  // -- syntax for not excluding certain packages
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './css/'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //   ]
      // },
    ],
  },
  plugins
};
