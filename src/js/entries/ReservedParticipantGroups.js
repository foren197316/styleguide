/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var ReservedParticipantGroupPanels = require('../components/ReservedParticipantGroupPanels');

$('document').ready(function () {
  var ReservedParticipantGroupsNode = document.getElementById('RootNode');
  React.render(
    ReservedParticipantGroupPanels({
      source: ReservedParticipantGroupsNode.dataset.source,
      employerId: ReservedParticipantGroupsNode.dataset.employer_id
    }),
    ReservedParticipantGroupsNode
  );
});
