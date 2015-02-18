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
        employers: OfferedParticipantGroupsNode.getAttribute('employers'),
        offeredParticipantGroups: OfferedParticipantGroupsNode.getAttribute('offeredParticipantGroups'),
        programs: OfferedParticipantGroupsNode.getAttribute('programs'),
        positions: OfferedParticipantGroupsNode.getAttribute('positions'),
        staffs: OfferedParticipantGroupsNode.getAttribute('staffs')
      }
    }),
    OfferedParticipantGroupsNode
  );
});
