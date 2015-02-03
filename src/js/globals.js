'use strict';

var moment = require('moment');

module.exports = {
  dateFormat: 'MM/dd/yyyy',

  parseIntBase10: function (string) {
    return parseInt(string, 10);
  },

  calculateAgeAtArrival: function (to, from) {
    return new moment(to).diff(moment(from), 'years');
  }
};
