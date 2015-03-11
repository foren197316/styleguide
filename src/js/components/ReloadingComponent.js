/* @flow */
'use strict';

var React = require('react/addons');
var Spinner = require('./Spinner');

module.exports = React.createClass({displayName: 'ReloadingComponent',
  propTypes: {
    loadingLink: React.PropTypes.object.isRequired /* React LinkState */
  },

  render: function () {
    if (this.props.loadingLink.value) {
      return React.createElement(Spinner, {});
    } else {
      return React.DOM.div({}, this.props.children);
    }
  }
});
