/* @flow */
'use strict';

var React = require('react/addons');
var UrlQueryMixin = require('../mixins').UrlQueryMixin;
var $ = require('jquery');

module.exports = React.createClass({displayName: 'AjaxSearchFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    searchOn: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
    ]).isRequired,
    autoFocus: React.PropTypes.bool,
    submit: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    delay: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      autoFocus: true,
      placeholder: 'Search',
      delay: 500
    };
  },

  getInitialState: function () {
    return {
      lastValue: '',
      value: ''
    };
  },

  componentDidMount: function () {
    var value = this.getValueFromUrl(this.searchField());

    if (value != null) {
      this.setState({ value: value });
    }

    if (this.props.autoFocus) {
      this.refs.searchInput.getDOMNode().focus();
    }

    $(this.refs.searchInput.getDOMNode()).bindDelayed('keyup change', this.props.delay, function () {
      if (this.state.value !== this.state.lastValue) {
        return this.props.submit();
      }
    }.bind(this));
  },

  onChange: function (event) {
    this.setState({
      lastValue: this.state.value,
      value: event.target.value
    });
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
    return React.DOM.label({className: 'list-group'},
      React.DOM.input({type: 'search', ref: 'searchInput', name: 'search_' + this.props.title, onChange: this.onChange, className: 'list-group-item form-control', placeholder: this.props.placeholder, value: this.state.value})
    );
  }
});
