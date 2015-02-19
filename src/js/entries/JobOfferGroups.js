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
        jobOfferGroups: JobOfferGroupsNode.dataset.job_offer_groups,
        programs: JobOfferGroupsNode.dataset.programs,
        positions: JobOfferGroupsNode.dataset.positions,
        employers: JobOfferGroupsNode.dataset.employers,
        staffs: JobOfferGroupsNode.dataset.staffs
      }
    }),
    JobOfferGroupsNode
  );
});
