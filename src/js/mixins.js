'use strict';

var actions = require('./actions');
var Spinner = require('./components/Spinner');

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
  }
};
