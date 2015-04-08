/* @flow */
'use strict';
let React = require('react/addons');
let Spinner = React.createFactory(require('./Spinner'));
let { div } = React.DOM;

let ReloadingComponent = React.createClass({
  displayName: 'ReloadingComponent',
  propTypes: {
    isLoading: React.PropTypes.bool.isRequired
  },

  render () {
    return this.props.isLoading ?
      Spinner() :
      div({}, this.props.children);
  }
});

module.exports = ReloadingComponent;
