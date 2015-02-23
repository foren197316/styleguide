/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var withRootNode = require('../root-node');
var ReservedParticipantGroupPanels = require('../components/ReservedParticipantGroupPanels');

withRootNode(function (rootNode) {
  React.render(ReservedParticipantGroupPanels({
    source: rootNode.dataset.source,
    employerId: rootNode.dataset.employer_id
  }), rootNode);
});
