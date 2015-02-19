/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var JobListingsIndex = require('../components/JobListingsIndex');

$('document').ready(function () {
  var JobListingsIndexNode = document.getElementById('JobListingsIndex');
  React.render(
    JobListingsIndex({
      urls: {
        jobListings: JobListingsIndexNode.dataset.job_listings
      }
    }),
    JobListingsIndexNode
  );
});
