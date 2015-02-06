/* @flow */
'use strict';

module.exports = {
  urlsafeEncode64: function (string) {
    return btoa(string).replace('+', '-').replace('/', '_');
  },

  urlsafeDecode64: function (string) {
    return atob(string.replace('-', '+').replace('_', '/'));
  }
};
