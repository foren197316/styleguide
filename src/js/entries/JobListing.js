/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var JobListingShow = require('../components/JobListingShow');
var rootNode = require('../root-node');

React.render(React.createElement(JobListingShow, {}), rootNode);
