/* @flow */
'use strict';
let React = require('react/addons');
let LoadingStore = require('../stores/LoadingStore');

let AjaxSearchForm = React.createClass({
  displayName: 'AjaxSearchForm',
  propTypes: {
    actions: React.PropTypes.object.isRequired,
    delay: React.PropTypes.number,
    callbacks: React.PropTypes.array
  },

  getDefaultProps () {
    return {
      delay: 750
    };
  },

  getInitialState () {
    return { lastData: null };
  },

  ajaxPost () {
    let data = [];

    for (let i in this.refs) {
      if (this.refs.hasOwnProperty(i)) {
        data.push(this.refs[i].query());
      }
    }

    let lastData = data.filter(datum => (datum != null)).join('&');

    if (lastData === this.state.lastData) {
      return;
    }

    LoadingStore.setTrue();
    this.setState({ lastData });

    let callbacks = (this.props.callbacks || []).concat([LoadingStore.setFalse]);

    this.props.actions.ajaxSearch(lastData, ...callbacks);
  },

  onSubmit (e) {
    if (e != null) {
      e.preventDefault();
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(this.ajaxPost, this.props.delay);
  },

  render () {
    return (
      React.DOM.form({method: '', action: '', onSubmit: this.onSubmit},
        React.Children.map(this.props.children, (child, index) => (
          React.addons.cloneWithProps(child, {
            ref: `child${index}`,
            submit: this.onSubmit
          })
        ))
      )
    );
  }
});

module.exports = AjaxSearchForm;
