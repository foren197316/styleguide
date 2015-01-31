'use strict';

var Reflux = require('reflux');
var PositionActions = require('../actions').PositionActions;

var PositionStore = Reflux.createStore({
  resourceName: 'positions',
  listenables: PositionActions
});

module.exports = PositionStore;
