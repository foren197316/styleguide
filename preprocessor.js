// preprocessor.js
var ReactTools = require('react-tools');
var debug = require('debug');
module.exports = {
  process: function(src, path) {
    var resultSrc = src;

    if (matches = path.match(/components\/(.*)\.js$/)) {
      resultSrc = "var React = require('../../../node_modules/react/addons');" + resultSrc;
      resultSrc = resultSrc + " module.exports = " + matches[1] + ";";
    }
    return resultSrc;
  }
};
