/* @flow */
'use strict';

var Base64 = require('./base64');
var QUERY = null;

var pageRegex = /\bpage=(\d+)\b/i;

var getQuery = function () {
  if (QUERY == null) {
    var hash = global.location.hash;

    if (hash.length > 1) {
      try {
        QUERY = Base64.urlsafeDecode64(hash.slice(1));
      } catch (e) {}
    }
  }
  return QUERY;
};

module.exports = {
  getQuery: getQuery,
  getCurrentPage: function () {
    var matches;
    if ((matches = pageRegex.exec(getQuery())) != null) {
      return parseInt(matches[1]) || 1;
    }
    return 1;
  }
};
