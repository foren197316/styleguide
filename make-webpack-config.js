var webpack = require('webpack');

module.exports = function (environment) {
  var baseEntries = [];
  var createEntry = function (component) {
    return baseEntries.concat([__dirname + '/src/js/entries/' + component + '.js']);
  };

  var config = {
    output: {
      path: __dirname + '/build/js',
      filename: '[name].min.js'
    },
    externals: {
      jquery: 'jQuery',
      'intercom.io': 'Intercom'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({minimize: true}),
      new webpack.optimize.CommonsChunkPlugin('interexchange-components.min.js'),
      new webpack.DefinePlugin({
        'process.env.__ENV__': JSON.stringify(environment)
      })
    ],
    module: {
      loaders: [
        { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ }
      ]
    },
    resolve: {
      extensions: ['', '.js']
    }
  };

  if (environment === 'development') {
    config.devtool = 'eval';
    config.output.publicPath = 'http://localhost:3000/js/';
    config.plugins = config.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]);
    config.module.loaders.unshift(
      { test: /\.jsx?$/, loaders: ['react-hot'], exclude: /node_modules/ }
    );
    baseEntries = baseEntries.concat([
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server'
    ]);
  }

  config.entry = {
    AwaitingOrdersParticipantGroups: createEntry('AwaitingOrdersParticipantGroups'),
    InMatchingParticipantGroups: createEntry('InMatchingParticipantGroups'),
    ReservedParticipantGroups: createEntry('ReservedParticipantGroups'),
    OnReviewParticipantGroups: createEntry('OnReviewParticipantGroups'),
    OfferedParticipantGroups: createEntry('OfferedParticipantGroups'),
    JobListings: createEntry('JobListings'),
    JobListing: createEntry('JobListing'),
    JobOfferGroups: createEntry('JobOfferGroups'),
    JobOfferParticipantAgreements: createEntry('JobOfferParticipantAgreements'),
    ParticipantBanner: createEntry('ParticipantBanner')
  };

  return config;
}
