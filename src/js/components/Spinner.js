'use strict';

var React = require('react/addons');

var Spinner = React.createClass({displayName: 'Spinner',
  render: function() {
    return (
      React.DOM.i({className: 'fa fa-spinner fa-spin'})
    );
  }
});

module.exports = Spinner;
