'use strict';

var React = require('react/addons');
var calculateAgeAtArrival = require('../globals').calculateAgeAtArrival;

var YearCalculator = React.createClass({displayName: 'YearCalculator',
  propTypes: {
    to: React.PropTypes.string.isRequired,
    from: React.PropTypes.string.isRequired
  },

  componentDidMount: function() {
    $(this.getDOMNode()).tooltip();
  },

  render: function() {
    return (
      React.DOM.span(null, calculateAgeAtArrival(this.props.to, this.props.from))
    );
  }
});

module.exports = YearCalculator;
