/* @flow */
'use strict';

var Reflux = require('reflux');
var actions = require('../actions');

module.exports = Reflux.createStore({
  listenables: actions.CountryActions,
  permission: false,

  init: function () {
    this.listenTo(actions.loadFromInMatchingParticipantGroups, this.onLoadFromInMatchingParticipantGroups);
  },

  onLoadFromInMatchingParticipantGroups: function (inMatchingParticipantGroups) {
    this.permission = true;
    var codes = {};

    this.data = inMatchingParticipantGroups.mapAttribute('participants').flatten().map(function (participant) {
      codes[participant.country_name] = participant.country_code;
      return participant.country_name;
    }).sort().uniq().map(function (countryName) {
      return { id: codes[countryName], name: countryName };
    });

    this.trigger(this.data);
  }
});
