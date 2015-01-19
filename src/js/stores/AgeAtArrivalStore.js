'use strict';

var AgeAtArrivalActions = require('../actions').AgeAtArrivalActions;

var AgeAtArrivalStore = Reflux.createStore({
  listenables: AgeAtArrivalActions,
  permission: true,

  init: function () {
    this.data = [
      { id: '21_and_over', name: '21 and Over' },
      { id: 'under_21', name: 'Under 21' }
    ];
  }
});

module.exports = AgeAtArrivalStore;
