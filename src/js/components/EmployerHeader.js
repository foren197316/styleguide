var EmployerHeader = React.createClass({displayName: 'EmployerHeader',
  propTypes: {
    employer: React.PropTypes.object.isRequired
  },

  render: function () {
    var employer = this.props.employer;
    var staff = StaffStore.findById(employer.staff_id) || {};

    return (
      React.DOM.div({className: "panel-heading"},
        React.DOM.h1({className: "panel-title"},
          React.DOM.span({className: "pull-right text-muted"}, staff.name),
          LinkToIf({name: employer.name, href: employer.href})
        )
      )
    )
  }
});
