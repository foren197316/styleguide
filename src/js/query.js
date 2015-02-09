/* @flow */
'use strict';

var Base64 = require('./base64');

var pageRegex = /\bpage=(\d+)\b/i;

var getQuery = function () {
  var hash = global.location.hash;
  var query;

  if (hash.length > 1) {
    try {
      query = Base64.urlsafeDecode64(hash.slice(1));
    } catch (e) {}
  }

  return query;
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
