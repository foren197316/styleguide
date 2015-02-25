/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var AwaitingOrdersParticipantGroupPanels = require('../components/AwaitingOrdersParticipantGroupPanels');
var withRootNode = require('../root-node');

withRootNode(function (rootNode) {
  React.render(AwaitingOrdersParticipantGroupPanels({
    source: rootNode.dataset.source
  }), rootNode);
});
