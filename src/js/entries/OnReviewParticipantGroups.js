/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var rootNode = require('../root-node');
var OnReviewParticipantGroupPanels = require('../components/OnReviewParticipantGroupPanels');

React.render(React.createElement(OnReviewParticipantGroupPanels, {}), rootNode);
