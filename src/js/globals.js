/* @flow */
'use strict';

var moment = require('moment');

var ymd = 'YYYY-MM-DD';

module.exports = {
  dateFormatMDY: 'MM/DD/YYYY',

  dateFormatYMD: ymd,

  parseIntBase10: function (string) {
    return parseInt(string, 10);
  },

  calculateAgeAtArrival: function (to, from) {
    return new moment(to, ymd).diff(moment(from, ymd), 'years');
  }
};
