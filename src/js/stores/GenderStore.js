/* @flow */
'use strict';

var Reflux = require('reflux');
var GenderActions = require('../actions').GenderActions;

module.exports = Reflux.createStore({
  listenables: GenderActions,
  permission: true,

  init: function () {
    this.data = [
      { id: 'Female', name: 'Female' },
      { id: 'Male', name: 'Male' }
    ];
  }
});
