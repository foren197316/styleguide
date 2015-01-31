'use strict';

var TimePeriod = require('datejs').TimePeriod;

module.exports = {
  dateFormat: 'MM/dd/yyyy',

  parseIntBase10: function (string) {
    return parseInt(string, 10);
  },

  calculateAgeAtArrival: function (to, from) {
    return new TimePeriod(Date.parse(to), Date.parse(from)).years;
  }
};
