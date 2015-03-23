/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var rootNode = require('../root-node');
var JobOfferParticipantAgreementsIndex = require('../components/JobOfferParticipantAgreementsIndex');

React.render(React.createElement(JobOfferParticipantAgreementsIndex, {
  exportUrl: rootNode.dataset.export
}), rootNode);
