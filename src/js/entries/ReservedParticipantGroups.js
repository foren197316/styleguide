/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var rootNode = require('../root-node');
var ReservedParticipantGroupPanels = require('../components/ReservedParticipantGroupPanels');

React.render(React.createElement(ReservedParticipantGroupPanels, {
  source: rootNode.dataset.source,
  employerId: rootNode.dataset.employer_id
}), rootNode);
