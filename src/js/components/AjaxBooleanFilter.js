/* @flow */
'use strict';

var React = require('react/addons');
var UrlQueryMixin = require('../mixins').UrlQueryMixin;

module.exports = React.createClass({displayName: 'AjaxBooleanFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    submit: React.PropTypes.func.isRequired,
    bool: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return { bool: true };
  },

  getInitialState: function () {
    return { isChecked: false };
  },

  componentDidMount: function () {
    var value = this.getValueFromUrl(this.searchField());

    if (value != null) {
      this.setState({ isChecked: true });
    }
  },

  onChange: function () {
    var isChecked = !this.state.isChecked;
    this.setState({ isChecked: isChecked }, function () {
      this.props.submit();
    }.bind(this));
  },

  searchField: function () {
    return this.props.fieldName + '_' + this.props.bool.toString();
  },

  query: function () {
    return this.state.isChecked ?
      'q[' + this.searchField() + ']=1' :
      null;
  },

  render: function () {
    return (
      React.DOM.div({className: 'panel panel-default'},
        React.DOM.div({className: 'panel-heading'}, this.props.title),
        React.DOM.div({className: 'list-group list-group-scrollable'},
          React.DOM.label({className: 'list-group-item'},
            React.DOM.input({ref: 'checkbox', type: 'checkbox', name: this.props.title.toLowerCase(), onChange: this.onChange, checked: this.state.isChecked}),
            React.DOM.span({className: 'title'}, this.props.label)
          )
        )
      )
    );
  }
});
