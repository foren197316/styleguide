/* @flow */
'use strict';
let Reflux = require('reflux');
let { PositionActions } = require('../actions');

let PositionStore = Reflux.createStore({
  resourceName: 'positions',
  listenables: PositionActions
});

module.exports = PositionStore;
