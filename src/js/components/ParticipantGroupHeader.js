/* @flow */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({displayName: 'ParticipantHeader',
  render: function () {
    return (
      React.DOM.div({className: 'panel-heading'},
        React.DOM.h1({className: 'panel-title'},
          this.props.children
        )
      )
    );
  }
});
