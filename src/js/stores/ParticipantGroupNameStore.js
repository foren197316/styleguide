/* @flow */
'use strict';

var Reflux = require('reflux');
var actions = require('../actions');

module.exports = Reflux.createStore({
  listenables: actions.ParticipantGroupNameActions,
  permission: true,
  init: function () {
    var names = [
      'Couple',
      'Individual',
      'Friends',
      'Cousins',
      'Siblings'
    ];

    this.data = names.map(function (name) {
      return { id: name, name: name };
    });

    this.trigger(this.data);
  }
});
