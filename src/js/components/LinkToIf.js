'use strict';

var React = require('react/addons');

var LinkToIf = React.createClass({displayName: 'LinkToIf',
  propTypes: {
    name: React.PropTypes.string.isRequired,
    href: React.PropTypes.string
  },

  render: function () {
    return this.props.href ?
      React.DOM.span({}, React.DOM.a({href: this.props.href}, this.props.name)) :
      React.DOM.span({}, this.props.name);
  }
});

module.exports = LinkToIf;
