/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var rootNode = require('../root-node');
var JobOfferGroupsIndex = require('../components/JobOfferGroupsIndex');

React.render(React.createElement(JobOfferGroupsIndex, {
  urls: {
    jobOfferGroups: rootNode.dataset.job_offer_groups,
    programs: rootNode.dataset.programs,
    positions: rootNode.dataset.positions,
    employers: rootNode.dataset.employers,
    export: rootNode.dataset.export,
    staffs: rootNode.dataset.staffs
  }
}), rootNode);
