/* @flow */
'use strict';

var React = require('react/addons');
var $ = require('jquery');
var UrlQueryMixin = require('../mixins').UrlQueryMixin;

module.exports = React.createClass({displayName: 'AjaxDateRangeFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    searchFrom: React.PropTypes.string.isRequired,
    searchTo: React.PropTypes.string.isRequired,
    submit: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      startFromDate: null,
      startToDate: null,
      finishFromDate: null,
      finishToDate: null
    };
  },

  setCheckedValues: function () {
    var state = {};

    var startFromValue = this.getValueFromUrl(this.props.searchFrom + '_gteq');
    if (startFromValue) {
      state.startFromDate = startFromValue;
    }

    var startToValue = this.getValueFromUrl(this.props.searchFrom + '_lteq');
    if (startToValue) {
      state.startToDate = startToValue;
    }

    var finishFromValue = this.getValueFromUrl(this.props.searchTo + '_gteq');
    if (finishFromValue) {
      state.finishFromDate = finishFromValue;
    }

    var finishToValue = this.getValueFromUrl(this.props.searchTo + '_lteq');
    if (finishToValue) {
      state.finishToDate = finishToValue;
    }

    this.setState(state);
  },

  componentDidMount: function () {
    this.setCheckedValues();

    $(this.getDOMNode())
      .find('.datepicker')
      .datepicker({autoclose: true, clearBtn: true})
      .on('hide', this.handleChange)
      .on('clear', this.handleChange);
  },

  handleChange: function () {
    this.setState({
      startFromDate : this.date('start_from') || null,
      startToDate   : this.date('start_to') || null,
      finishFromDate: this.date('finish_from') || null,
      finishToDate  : this.date('finish_to') || null
    }, function () {
      this.props.submit();
    }.bind(this));
  },

  date: function (name) {
    return this.refs[name].getDOMNode().value;
  },

  query: function () {
    var queries = [];

    if (this.date('start_from')) {
      queries.push('q[' + this.props.searchFrom + '_gteq]=' + this.date('start_from'));
    }

    if (this.date('start_to')) {
      queries.push('q[' + this.props.searchFrom + '_lteq]=' + this.date('start_to'));
    }

    if (this.date('finish_from')) {
      queries.push('q[' + this.props.searchTo + '_gteq]=' + this.date('finish_from'));
    }

    if (this.date('finish_to')) {
      queries.push('q[' + this.props.searchTo + '_lteq]=' + this.date('finish_to'));
    }

    return queries.length > 0 ? queries.join('&') : null;
  },

  render: function () {
    return (
      React.DOM.div({className: 'panel panel-default'},
        React.DOM.div({className: 'panel-heading'}, 'Start'),
        React.DOM.div({className: 'list-group list-group-scrollable'},
          React.DOM.label({className: 'list-group-item'},
            React.DOM.span({className: 'title'}, 'From'),
            React.DOM.input({type: 'text', ref: 'start_from', name: 'start_from', className: 'datepicker start from form-control', value: this.state.startFromDate})
          ),
          React.DOM.label({className: 'list-group-item'},
            React.DOM.span({className: 'title'}, 'To'),
            React.DOM.input({type: 'text', ref: 'start_to', name: 'start_to', className: 'datepicker start to form-control', value: this.state.startToDate})
          )
        ),
        React.DOM.div({className: 'panel-heading'}, 'Finish'),
        React.DOM.div({className: 'list-group list-group-scrollable'},
          React.DOM.label({className: 'list-group-item'},
            React.DOM.span({className: 'title'}, 'From'),
            React.DOM.input({type: 'text', ref: 'finish_from', name: 'finish_from', className: 'datepicker finish from form-control', value: this.state.finishFromDate})
          ),
          React.DOM.label({className: 'list-group-item'},
            React.DOM.span({className: 'title'}, 'To'),
            React.DOM.input({type: 'text', ref: 'finish_to', name: 'finish_to', className: 'datepicker finish to form-control', value: this.state.finishToDate})
          )
        )
      )
    );
  }
});
