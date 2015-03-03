'use strict';

var $ = require('jquery');

module.exports = function () {
  return $('meta[name="csrf-token"]').attr('content');
};
