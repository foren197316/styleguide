/* @flow */
'use strict';

require('../main');
var rootNode = require('../root-node');
var React = require('react/addons');
var InMatchingParticipantGroupsIndex = require('../components/InMatchingParticipantGroupsIndex');

React.render(React.createElement(InMatchingParticipantGroupsIndex, {
  urls: {
    employer: rootNode.dataset.employer,
    inMatchingParticipantGroups: rootNode.dataset.in_matching_participant_groups,
    programs: rootNode.dataset.programs,
    positions: rootNode.dataset.positions,
    countries: rootNode.dataset.countries
  }
}), rootNode);
