let { VIEW, NODE_ENV, PACK } = process.env;
NODE_ENV = NODE_ENV || 'production';

const path = require('path');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const isProduction = NODE_ENV === 'production';

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
          source: './js/*.css*',
          destination: './css',
        },
      ]},
      {delete: [
        './js/*.css*',
      ]},
      ...(PACK ? [
        // move important files to /tmp for zipping
        {mkdir: [`./${VIEW}/`, `./${VIEW}/html/`, `./${VIEW}/img/`, `./${VIEW}/css/`, `./${VIEW}/js`]},
        {copy: [
          { source: './html/**/*.html', destination: `./${VIEW}/html` },
          { source: './img/**/*', destination: `./${VIEW}/img` },
          { source: './css/**/custom1.css', destination: `./${VIEW}/css` },
          { source: './js/**/custom.js', destination: `./${VIEW}/js` },
        ]},
        {archive: [
          {
            source: `./${VIEW}/**/*`,
            destination: `../../../packages/${VIEW}.${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 12) }.${isProduction ? 'production' : NODE_ENV }.zip`
          }
        ]},
        {delete: ['./NYU/']}
      ] : []),
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
    ],
  },
  plugins
};
