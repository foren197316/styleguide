/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var withRootNode = require('../root-node');
var OnReviewParticipantGroupPanels = require('../components/OnReviewParticipantGroupPanels');

withRootNode(function (rootNode) {
  React.render(React.createElement(OnReviewParticipantGroupPanels, {
    employerId: rootNode.dataset.employer_id,
    employerName: rootNode.dataset.employer_name,
    source: rootNode.dataset.source
  }), rootNode);
});
