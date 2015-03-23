/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var rootNode = require('../root-node');
var JobOfferGroupsIndex = require('../components/JobOfferGroupsIndex');

React.render(React.createElement(JobOfferGroupsIndex, {
  exportUrl: rootNode.dataset.export
}), rootNode);
