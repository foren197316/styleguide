'use strict';

var calculateAgeAtArrival = require('../globals').calculateAgeAtArrival;

var YearCalculator = React.createClass({displayName: 'YearCalculator',
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
