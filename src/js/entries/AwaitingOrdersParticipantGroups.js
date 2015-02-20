/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var AwaitingOrdersParticipantGroupPanels = require('../components/AwaitingOrdersParticipantGroupPanels');

$('document').ready(function () {
  var AwaitingOrdersParticipantGroupPanelsNode = document.getElementById('RootNode');
  React.render(
    AwaitingOrdersParticipantGroupPanels({
      source: AwaitingOrdersParticipantGroupPanelsNode.dataset.source
    }),
    AwaitingOrdersParticipantGroupPanelsNode
  );
});
