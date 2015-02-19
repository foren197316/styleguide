/* @flow */
'use strict';

module.exports = function (string) {
  return '$' + (parseFloat(string) || 0).toFixed(2);
};
