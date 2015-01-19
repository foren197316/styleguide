'use strict';

var actions = require('../actions');

var ParticipantGroupNameStore = Reflux.createStore({
  listenables: actions.ParticipantGroupNameActions,
  permission: false,

  init: function () {
    this.listenTo(actions.loadFromInMatchingParticipantGroups, this.onLoadFromInMatchingParticipantGroups);
  },

  onLoadFromInMatchingParticipantGroups: function (inMatchingParticipantGroups) {
    this.permission = true;

    this.data = inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
      return inMatchingParticipantGroup.name;
    }).sort().uniq().map(function (name) {
      return { id: name, name: name };
    });

    this.trigger(this.data);
  }
});

module.exports = ParticipantGroupNameStore;
