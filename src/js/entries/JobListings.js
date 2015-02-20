/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var JobListingsIndex = require('../components/JobListingsIndex');

$('document').ready(function () {
  var JobListingsNode = document.getElementById('RootNode');
  React.render(
    JobListingsIndex({
      urls: {
        jobListings: JobListingsNode.dataset.job_listings
      }
    }),
    JobListingsNode
  );
});
