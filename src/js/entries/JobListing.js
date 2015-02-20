/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var JobListingDetails = require('../components/JobListingDetails');

$('document').ready(function () {
  var JobListingNode = document.getElementById('JobListing');
  React.render(
    JobListingDetails({
      urls: {
        jobListing: JobListingNode.dataset.job_listing
      }
    }),
    JobListingNode
  );
});
