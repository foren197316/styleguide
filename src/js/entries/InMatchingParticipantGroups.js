/* @flow */
'use strict';

require('../main');
var withRootNode = require('../root-node');
var React = require('react/addons');
var InMatchingParticipantGroupsIndex = require('../components/InMatchingParticipantGroupsIndex');

withRootNode(function (rootNode) {
  React.render(InMatchingParticipantGroupsIndex({
    urls: {
      employer: rootNode.dataset.employer,
      inMatchingParticipantGroups: rootNode.dataset.in_matching_participant_groups,
      programs: rootNode.dataset.programs,
      positions: rootNode.dataset.positions,
      countries: rootNode.dataset.countries
    }
  }), rootNode);
});
