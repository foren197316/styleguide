/* @flow */
'use strict';
let React = require('react/addons');
let { span, a } = React.DOM;

let LinkToIf = React.createClass({
  displayName: 'LinkToIf',
  propTypes: {
    name: React.PropTypes.string.isRequired,
    href: React.PropTypes.string
  },

  render () {
    if (this.props.href) {
      return a({href: this.props.href}, this.props.name);
    } else if (React.Children.count(this.props.children) > 0) {
      return span({}, this.props.children);
    } else {
      return span({}, this.props.name);
    }
  }
});

module.exports = LinkToIf;
