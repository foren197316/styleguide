/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var withRootNode = require('../root-node');
var JobListingsIndex = require('../components/JobListingsIndex');

withRootNode(function (rootNode) {
  React.render(JobListingsIndex({
    urls: {
      jobListings: rootNode.dataset.job_listings
    }
  }), rootNode);
});
