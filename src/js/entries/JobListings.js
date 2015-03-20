/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var rootNode = require('../root-node');
var JobListingsIndex = require('../components/JobListingsIndex');

React.render(React.createElement(JobListingsIndex, {}), rootNode);
