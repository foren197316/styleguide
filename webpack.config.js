var webpack = require('webpack');

module.exports = {
  // devtool: '#source-map',
  devtool: 'eval',
  entry: {
    'interexchange-components': [
      // 'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      __dirname + '/src/js/main.js'
    ]
  },
  output: {
    path: __dirname + '/src/js/',
    filename: 'interexchange-components.min.js',
    // sourceMapFilename: '../maps/interexchange-components.min.js.map',
    publicPath: 'http://localhost:3000/src/js/'
  },
  externals: {
    jquery: 'jQuery',
    'intercom.io': 'Intercom'
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    // new webpack.optimize.CommonsChunkPlugin('common.min.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: require.resolve('react'), loader: 'expose?React' },
      { test: /components\/.*\.js$/, loaders: ['react-hot'] }
    ]
  }
};
