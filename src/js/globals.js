'use strict';

var moment = require('moment');

var ydm = 'YYYY-DD-MM';

module.exports = {
  dateFormatMDY: 'MM/DD/YYYY',

  dateFormatYDM: ydm,

  parseIntBase10: function (string) {
    return parseInt(string, 10);
  },

  calculateAgeAtArrival: function (to, from) {
    return new moment(to, ydm).diff(moment(from, ydm), 'years');
  }
};
