var webpack = require('webpack');

var createEntry = function (component) {
  return [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    __dirname + '/src/js/entries/' + component + '.js'
  ];
};

module.exports = {
  devtool: 'eval',
  entry: {
    awaiting_orders_participant_groups: createEntry('awaiting_orders_participant_groups'),
    in_matching_participant_groups: createEntry('in_matching_participant_groups'),
    reserved_participant_groups: createEntry('reserved_participant_groups'),
    on_review_participant_groups: createEntry('on_review_participant_groups'),
    offered_participant_groups: createEntry('offered_participant_groups'),
    job_offer_groups: createEntry('job_offer_groups'),
    job_offer_participant_agreements: createEntry('job_offer_participant_agreements')
  },
  output: {
    path: __dirname + '/build/js/',
    filename: '[name].min.js',
    publicPath: 'http://localhost:3000/js/'
  },
  externals: {
    jquery: 'jQuery',
    'intercom.io': 'Intercom'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.optimize.CommonsChunkPlugin('common.min.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: /components\/.*\.js$/, loaders: ['react-hot'] }
    ]
  }
};
