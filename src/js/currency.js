/* @flow */
'use strict';

module.exports = function (string) {
  return '$' + parseFloat(string).toFixed(2);
};
