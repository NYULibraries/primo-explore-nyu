module.exports = {
  // modifications to the devenv webpack process can go here
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(@sentry\/browser)\/).*/,
      },
    ]
  },
  output: {
    chunkFilename: 'js/custom.[name].js',
  }
};