/* @flow */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({displayName: 'ParticipantGroupHeader',
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
