/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var rootNode = require('../root-node');
var OfferedParticipantGroupsIndex = require('../components/OfferedParticipantGroupsIndex');

React.render(React.createElement(OfferedParticipantGroupsIndex, {}), rootNode);
