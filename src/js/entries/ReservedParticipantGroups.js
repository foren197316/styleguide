/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var ReservedParticipantGroupPanels = require('../components/ReservedParticipantGroupPanels');

$('document').ready(function () {
  var ReservedParticipantGroupsNode = document.getElementById('ReservedParticipantGroups');
  React.render(
    ReservedParticipantGroupPanels({
      source: ReservedParticipantGroupsNode.getAttribute('source'),
      employerId: ReservedParticipantGroupsNode.getAttribute('employerId')
    }),
    ReservedParticipantGroupsNode
  );
});
