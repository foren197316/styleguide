/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var JobListingShow = require('../components/JobListingShow');
var withRootNode = require('../root-node');

withRootNode(function (rootNode) {
  React.render(React.createElement(JobListingShow, {
    urls: {
      jobListing: rootNode.dataset.job_listing
    }
  }), rootNode);
});
