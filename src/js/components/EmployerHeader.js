/* @flow */
'use strict';

var React = require('react/addons');
var StaffStore = require('../stores/StaffStore');
var LinkToIf = require('./LinkToIf');
var ParticipantGroupHeader = require('./ParticipantGroupHeader');

module.exports = React.createClass({displayName: 'EmployerHeader',
  propTypes: {
    employer: React.PropTypes.object.isRequired
  },

  render: function () {
    var employer = this.props.employer;
    var staff = StaffStore.findById(employer.staff_id) || {};

    return React.createElement(ParticipantGroupHeader, {},
      React.DOM.span({className: 'pull-right text-muted'}, staff.name),
      React.createElement(LinkToIf, {name: employer.name, href: employer.href})
    );
  }
});
