/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var JobListingIndex = require('../components/JobListingIndex');

$('document').ready(function () {
  var JobListingNode = document.getElementById('RootNode');
  React.render(
    JobListingIndex({
      urls: {
        jobListing: JobListingNode.dataset.job_listing
      }
    }),
    JobListingNode
  );
});
