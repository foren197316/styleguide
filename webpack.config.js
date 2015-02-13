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
    path: './webpack',
    filename: '[name].min.js',
    sourceMapFilename: '[file].map'
  },
  externals: {
    jquery: 'jQuery',
    'react/addons': 'React',
    reflux: 'Reflux',
    'react-bootstrap': 'ReactBootstrap',
    'react-radio-group': 'RadioGroup',
    'intercom.io': 'Intercom',
    moment: 'moment'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};
