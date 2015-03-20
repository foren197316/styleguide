/* @flow */
'use strict';

require('../main');
var rootNode = require('../root-node');
var React = require('react/addons');
var InMatchingParticipantGroupsIndex = require('../components/InMatchingParticipantGroupsIndex');

React.render(React.createElement(InMatchingParticipantGroupsIndex, {}), rootNode);
