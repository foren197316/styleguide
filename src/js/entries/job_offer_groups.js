/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var JobOfferGroupsIndex = require('../components/JobOfferGroupsIndex');

$('document').ready(function () {
  var JobOfferGroupsNode = document.getElementById('JobOfferGroups');
  React.render(
    JobOfferGroupsIndex({
      urls: {
        jobOfferGroups: JobOfferGroupsNode.getAttribute('jobOfferGroups'),
        programs: JobOfferGroupsNode.getAttribute('programs'),
        positions: JobOfferGroupsNode.getAttribute('positions'),
        employers: JobOfferGroupsNode.getAttribute('employers'),
        staffs: JobOfferGroupsNode.getAttribute('staffs')
      }
    }),
    JobOfferGroupsNode
  );
});
