var EmployerHeader = React.createClass({
  mixins: [
    Reflux.connect(StaffStore, "staffs"),
    Reflux.connect(EmployerStore, "employers"),
    RenderLoadedMixin("staffs", "employers", { placeholder: null })
  ],

  propTypes: {
    employer_id: React.PropTypes.number.isRequired
  },

  renderLoaded: function () {
    var employer = this.state.employers.findById(this.props.employer_id);
    var staff = this.state.staffs.findById(employer.staff_id) || {};

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
