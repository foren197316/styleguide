/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var AwaitingOrdersParticipantGroupPanels = require('../components/AwaitingOrdersParticipantGroupPanels');
var rootNode = require('../root-node');

React.render(React.createElement(AwaitingOrdersParticipantGroupPanels, {
  source: rootNode.dataset.source
}), rootNode);
