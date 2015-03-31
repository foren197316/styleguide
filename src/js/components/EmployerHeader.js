/* @flow */
'use strict';
let React = require('react/addons');
let LinkToIf = React.createFactory(require('./LinkToIf'));
let ParticipantGroupHeader = React.createFactory(require('./ParticipantGroupHeader'));
let { span } = React.DOM;

let EmployerHeader = React.createClass({
  displayName: 'EmployerHeader',
  propTypes: {
    employer: React.PropTypes.object.isRequired,
    staff: React.PropTypes.object,
  },

  render () {
    let { employer, staff } = this.props;
    staff = staff || {};

    return (
      ParticipantGroupHeader({},
        span({className: 'pull-right text-muted'}, staff.name),
        LinkToIf({name: employer.name, href: employer.href})
      )
    );
  }
});

module.exports = EmployerHeader;
