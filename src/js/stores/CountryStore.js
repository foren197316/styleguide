/* @flow */
'use strict';

var Reflux = require('reflux');
var CountryActions = require('../actions').CountryActions;

module.exports = Reflux.createStore({
  resourceName: 'countries',
  listenables: CountryActions,
  initPostAjaxLoad: function (data) {
    this.data = [];
    var countries = data[0];

    for (var code in countries) {
      if (countries.hasOwnProperty(code)) {
        this.data.push({
          id: code,
          name: countries[code]
        });
      }
    }

    this.trigger(this.data);
  }
});
