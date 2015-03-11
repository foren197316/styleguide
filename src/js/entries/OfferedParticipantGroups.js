/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var withRootNode = require('../root-node');
var OfferedParticipantGroupsIndex = require('../components/OfferedParticipantGroupsIndex');

withRootNode(function (rootNode) {
  React.render(React.createElement(OfferedParticipantGroupsIndex, {
    urls: {
      employers: rootNode.dataset.employers,
      offeredParticipantGroups: rootNode.dataset.offered_participant_groups,
      programs: rootNode.dataset.programs,
      positions: rootNode.dataset.positions,
      staffs: rootNode.dataset.staffs
    }
  }), rootNode);
});
