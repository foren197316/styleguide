/* @flow */
'use strict';

var Reflux = require('reflux');
var PositionActions = require('../actions').PositionActions;

module.exports = Reflux.createStore({
  resourceName: 'positions',
  listenables: PositionActions
});
