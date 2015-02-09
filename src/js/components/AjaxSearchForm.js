/* @flow */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({displayName: 'AjaxSearchForm',
  propTypes: {
    url: React.PropTypes.string.isRequired,
    actions: React.PropTypes.object.isRequired,
    includedStores: React.PropTypes.array
  },

  getDefaultProps: function () {
    return {
      includedStores: []
    };
  },

  getInitialState: function () {
    return {
      sending: false
    };
  },

  onSubmit: function (e) {
    if (e != null) {
      e.preventDefault();
    }

    var data = [];
    this.setState({ sending: true });

    for (var i in this.refs) {
      if (this.refs.hasOwnProperty(i)) {
        data.push(this.refs[i].query());
      }
    }

    data = data.filter(function (datum) {
      return datum != null;
    }).join('&');

    this.props.actions.ajaxSearch(data, function () {
      this.setState({ sending: false });
    }.bind(this));
  },

  render: function () {
    var buttonAttributes = {
      className: 'btn btn-block btn-default',
      type: 'submit',
      style: { marginBottom: '15px'},
      disabled: this.state.sending ? 'disabled' : ''
    };

    return (
      React.DOM.form({method: '', action: '', onSubmit: this.onSubmit},
        React.Children.map(this.props.children, function (child, index) {
          return React.addons.cloneWithProps(child, { ref: 'child' + index, submit: this.onSubmit });
        }.bind(this)),
        React.DOM.button(buttonAttributes, 'Search')
      )
    );
  }
});
