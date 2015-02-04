/* @flow */
'use strict';

var React = require('react/addons');
var actions = require('./actions');
var Spinner = require('./components/Spinner');
var Base64 = require('./base64');

module.exports = {
  SetUrlsMixin: {
    propTypes: {
      urls: React.PropTypes.object.isRequired
    },

    componentDidMount: function () {
      actions.setUrls(this.props.urls);
    }
  },

  ValidatingInputMixin: {
    statics: { validates: true },

    propTypes: { validationState: React.PropTypes.object.isRequired },

    getInitialState: function() {
      return {value: null};
    },

    handleChange: function (event) {
      var newState = this.validate(event.target.value);
      this.setState({value: event.target.value});
      this.props.validationState.requestChange(newState);
    }
  },

  RenderLoadedMixin: function () {
    var args = arguments;

    if (args.length === 0) {
      throw new Error('RenderLoadedMixin takes at least one string argument.');
    }

    return {
      render: function () {
        for (var i=0; i<args.length; i++) {
          if (!this.state[args[i]]) {
            return Spinner(null);
          }
        }
        return this.renderLoaded();
      }
    };
  },

  UrlQueryMixin: {
    getValueFromUrl: function () {
      var pathParts = global.location.pathname.split(':');
      var query = null;

      if (pathParts.length > 1) {
        try {
          query = Base64.urlsafeDecode64(pathParts[pathParts.length-1]);
        } catch (e) {}
      }

      if (query != null) {
        var re = new RegExp('q\\[' + this.query() + '\\]=([^&]+)');
        var matches = query.match(re);
        if (matches) {
          return matches[1];
        }
      }

      return null;
    }
  }
};
