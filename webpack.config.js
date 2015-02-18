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
    AwaitingOrdersParticipantGroups: createEntry('AwaitingOrdersParticipantGroups'),
    InMatchingParticipantGroups: createEntry('InMatchingParticipantGroups'),
    ReservedParticipantGroups: createEntry('ReservedParticipantGroups'),
    OnReviewParticipantGroups: createEntry('OnReviewParticipantGroups'),
    OfferedParticipantGroups: createEntry('OfferedParticipantGroups'),
    JobOfferGroups: createEntry('JobOfferGroups'),
    JobOfferParticipantAgreements: createEntry('JobOfferParticipantAgreements')
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
