// preprocessor.js
var ReactTools = require('react-tools');
var debug = require('debug');
module.exports = {
  process: function(src, path) {
    var resultSrc = src;

    var parts = path.split('/');
    var dir = parts[parts.length-2];

    if (/^(js|components|stores)$/.test(dir)) {
      var upDirs = '../../';
      if (dir === 'components' || dir === 'stores') {
        upDirs += '../';
      }
      resultSrc = resultSrc.replace("'use strict';", "var React=require('" + upDirs + "node_modules/react/addons'),\nReflux=require('" + upDirs + "node_modules/reflux/index');");
    }

    return resultSrc;
  }
};
