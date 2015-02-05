/* @flow */
'use strict';

var React = require('react/addons');
var UrlQueryMixin = require('../mixins').UrlQueryMixin;

module.exports = React.createClass({displayName: 'AjaxSearchFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    searchOn: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
    ]).isRequired,
    autoFocus: React.PropTypes.bool,
    placeholder: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      autoFocus: true,
      placeholder: 'Search'
    };
  },

  getInitialState: function () {
    return { value: '' };
  },

  componentDidMount: function () {
    var value = this.getValueFromUrl(this.searchField());

    if (value != null) {
      this.setState({ value: value });
    }

    if (this.props.autoFocus) {
      this.refs.searchInput.getDOMNode().focus();
    }
  },

  onChange: function (event) {
    this.setState({ value: event.target.value });
  },

  searchField: function () {
    return [].concat(this.props.searchOn).join('_or_') + '_matches';
  },

  query: function () {
    if (this.state.value.length > 0) {
      return 'q[' + this.searchField() + ']=' + this.state.value;
    } else {
      return null;
    }
  },

  render: function () {
    return (
      React.DOM.label({className: 'list-group'},
        React.DOM.input({type: 'search', ref: 'searchInput', name: 'search_' + this.props.title, onChange: this.onChange, className: 'list-group-item form-control', placeholder: this.props.placeholder, value: this.state.value})
      )
    );
  }
});
