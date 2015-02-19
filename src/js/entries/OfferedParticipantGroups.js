/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var OfferedParticipantGroupsIndex = require('../components/OfferedParticipantGroupsIndex');

$('document').ready(function () {
  var OfferedParticipantGroupsNode = document.getElementById('OfferedParticipantGroups');
  React.render(
    OfferedParticipantGroupsIndex({
      urls: {
        employers: OfferedParticipantGroupsNode.dataset.employers,
        offeredParticipantGroups: OfferedParticipantGroupsNode.dataset.offered_participant_groups,
        programs: OfferedParticipantGroupsNode.dataset.programs,
        positions: OfferedParticipantGroupsNode.dataset.positions,
        staffs: OfferedParticipantGroupsNode.dataset.staffs
      }
    }),
    OfferedParticipantGroupsNode
  );
});
