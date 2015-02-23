'use strict';

var $ = require('jquery');

module.exports = function (callback) {
  $('document').ready(function () {
    callback(global.document.getElementById('RootNode'));
  });
};
