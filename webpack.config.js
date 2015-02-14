var webpack = require('webpack');

module.exports = {
  devtool: '#source-map',
  entry: {
    AwaitingOrdersParticipantGroupPanels: './src/js/components/AwaitingOrdersParticipantGroupPanels.js',
    InMatchingParticipantGroupsIndex: './src/js/components/InMatchingParticipantGroupsIndex.js',
    ReservedParticipantGroupPanels: './src/js/components/ReservedParticipantGroupPanels.js',
    OnReviewParticipantGroupPanels: './src/js/components/OnReviewParticipantGroupPanels.js',
    OfferedParticipantGroupsIndex: './src/js/components/OfferedParticipantGroupsIndex.js',
    JobOfferGroupsIndex: './src/js/components/JobOfferGroupsIndex.js',
    JobOfferParticipantAgreementsIndex: './src/js/components/JobOfferParticipantAgreementsIndex.js'
  },
  output: {
    path: './build/js',
    filename: '[name].min.js',
    sourceMapFilename: '../maps/[file].map'
  },
  externals: {
    jquery: 'jQuery',
    'intercom.io': 'Intercom'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.optimize.CommonsChunkPlugin('common.min.js')
  ]
};
