/* @flow */
'use strict';

var Reflux = require('reflux');
var AgeAtArrivalActions = require('../actions').AgeAtArrivalActions;

module.exports = Reflux.createStore({
  listenables: AgeAtArrivalActions,
  permission: true,

  init: function () {
    this.data = [
      { id: 'gteq', name: '21 and Over', value: 21 },
      { id: 'lt', name: 'Under 21', value: 21 }
    ];
  }
});
