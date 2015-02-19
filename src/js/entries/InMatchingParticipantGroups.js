/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var InMatchingParticipantGroupsIndex = require('../components/InMatchingParticipantGroupsIndex');

$('document').ready(function () {
  var InMatchingParticipantGroupsNode = document.getElementById('InMatchingParticipantGroups');
  React.render(
    InMatchingParticipantGroupsIndex({
      urls: {
        employer: InMatchingParticipantGroupsNode.dataset.employer,
        inMatchingParticipantGroups: InMatchingParticipantGroupsNode.dataset.in_matching_participant_groups,
        programs: InMatchingParticipantGroupsNode.dataset.programs,
        positions: InMatchingParticipantGroupsNode.dataset.positions,
        countries: InMatchingParticipantGroupsNode.dataset.countries
      }
    }),
    InMatchingParticipantGroupsNode
  );
});
