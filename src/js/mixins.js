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
    regExEscape: function (string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },

    getQuery: function () {
      var hash = global.location.hash;
      var query = null;

      if (hash.length > 1) {
        try {
          query = Base64.urlsafeDecode64(hash.slice(1));
        } catch (e) {}
      }

      return query;
    },

    getValueFromUrl: function (searchField) {
      var query = this.getQuery();

      if (query != null) {
        var results = [];
        var re = new RegExp('q\\[' + this.regExEscape(searchField) + '\\](\\[\\])?=([^&]+)', 'g');
        var matched = false;
        var matches;
        while ((matches = re.exec(query)) != null) {
          matched = true;
          if (matches[1] == null) {
            return matches[2];
          }
          results.push(matches[2]);
        }

        return matched ? results : null;
      }

      return null;
    }
  }
};
