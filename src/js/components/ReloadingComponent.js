/* @flow */
'use strict';

let React = require('react/addons');
let Spinner = React.createFactory(require('./Spinner'));
let { div } = React.DOM;

let ReloadingComponent = React.createClass({
  displayName: 'ReloadingComponent',
  propTypes: {
    loadingLink: React.PropTypes.object.isRequired /* React LinkState */
  },

  render () {
    if (this.props.loadingLink.value) {
      return Spinner();
    } else {
      return div({}, this.props.children);
    }
  }
});

module.exports = ReloadingComponent;
