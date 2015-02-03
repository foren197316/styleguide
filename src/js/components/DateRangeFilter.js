'use strict';

var React = require('react/addons');
var moment = require('moment');
var $ = require('jquery');
var dateFormatMDY = require('../globals').dateFormatMDY;

var DateRangeFilter = React.createClass({displayName: 'DateRangeFilter',
  propTypes: {
    searchFrom: React.PropTypes.string.isRequired,
    searchTo: React.PropTypes.string.isRequired,
    actions:  React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    $(this.getDOMNode())
      .find('.datepicker')
      .datepicker({autoclose: true, clearBtn: true})
      .on('hide', this.handleChange)
      .on('clear', this.handleChange);
  },

  handleChange: function () {
    var startFromDate = moment(this.refs.start_from.getDOMNode().value, dateFormatMDY),
        startToDate   = moment(this.refs.start_to.getDOMNode().value, dateFormatMDY),
        finishFromDate= moment(this.refs.finish_from.getDOMNode().value, dateFormatMDY),
        finishToDate  = moment(this.refs.finish_to.getDOMNode().value, dateFormatMDY);

    this.props.actions.dateFilter(
      this.props.searchFrom,
      this.props.searchTo,
      startFromDate,
      startToDate,
      finishFromDate,
      finishToDate
    );
  },

  render: function () {
    return (
      React.DOM.div({className: 'panel panel-default'},
        React.DOM.div({className: 'panel-heading'}, 'Start'),
        React.DOM.div({className: 'list-group list-group-scrollable'},
          React.DOM.label({className: 'list-group-item'},
            React.DOM.span({className: 'title'}, 'From'),
            React.DOM.input({type: 'text', ref: 'start_from', className: 'datepicker start from form-control'})
          ),
          React.DOM.label({className: 'list-group-item'},
            React.DOM.span({className: 'title'}, 'To'),
            React.DOM.input({type: 'text', ref: 'start_to', className: 'datepicker start to form-control'})
          )
        ),
        React.DOM.div({className: 'panel-heading'}, 'Finish'),
        React.DOM.div({className: 'list-group list-group-scrollable'},
          React.DOM.label({className: 'list-group-item'},
            React.DOM.span({className: 'title'}, 'From'),
            React.DOM.input({type: 'text', ref: 'finish_from', className: 'datepicker finish from form-control'})
          ),
          React.DOM.label({className: 'list-group-item'},
            React.DOM.span({className: 'title'}, 'To'),
            React.DOM.input({type: 'text', ref: 'finish_to', className: 'datepicker finish to form-control'})
          )
        )
      )
    );
  }
});

module.exports = DateRangeFilter;
