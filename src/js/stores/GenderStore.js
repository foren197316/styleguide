'use strict';

var GenderActions = require('../actions').GenderActions;

var GenderStore = Reflux.createStore({
  listenables: GenderActions,
  permission: true,

  init: function () {
    this.data = [
      { id: 'Female', name: 'Female' },
      { id: 'Male', name: 'Male' }
    ];
  }
});

module.exports = GenderStore;
