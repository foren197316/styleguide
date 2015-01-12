var EmployerHeader = React.createClass({
  propTypes: {
    employer: React.PropTypes.object.isRequired
  },

  render: function () {
    var employer = this.props.employer;
    var staff = StaffStore.findById(employer.staff_id) || {};

    return (
      <div className="panel-heading">
        <h1 className="panel-title">
          <span className="pull-right text-muted">{staff.name}</span>
          <LinkToIf name={employer.name} href={employer.href} />
        </h1>
      </div>
    )
  }
});
