'use strict';

var Reflux = require('reflux');
var actions = require('../actions');

var CountryStore = Reflux.createStore({
  listenables: actions.CountryActions,
  permission: false,

  init: function () {
    this.listenTo(actions.loadFromInMatchingParticipantGroups, this.onLoadFromInMatchingParticipantGroups);
  },

  onLoadFromInMatchingParticipantGroups: function (inMatchingParticipantGroups) {
    this.permission = true;

    this.data = inMatchingParticipantGroups.mapAttribute('participants').flatten().mapAttribute('country_name').flatten().sort().uniq().map(function (countryName) {
      return { id: countryName, name: countryName };
    });

    this.trigger(this.data);
  }
});

module.exports = CountryStore;
