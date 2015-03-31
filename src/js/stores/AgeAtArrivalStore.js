/* @flow */
'use strict';
let Reflux = require('reflux');
let { AgeAtArrivalActions } = require('../actions');

let AgeAtArrivalStore = Reflux.createStore({
  listenables: AgeAtArrivalActions,
  permission: true,

  init () {
    this.data = [
      { id: 'gteq', name: '21 and Over', value: 21 },
      { id: 'lt', name: 'Under 21', value: 21 }
    ];
  }
});

module.exports = AgeAtArrivalStore;
