/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var JobListingShow = require('../components/JobListingShow');

$('document').ready(function () {
  var JobListingNode = document.getElementById('RootNode');
  React.render(
    JobListingShow({
      urls: {
        jobListing: JobListingNode.dataset.job_listing
      }
    }),
    JobListingNode
  );
});
