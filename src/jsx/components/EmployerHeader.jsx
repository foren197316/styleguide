var EmployerHeader = React.createClass({
  mixins: [
    Reflux.connect(StaffStore, "staffs"),
    RenderLoadedMixin("staffs", { placeholder: null })
  ],

  propTypes: {
    employer: React.PropTypes.object.isRequired
  },

  renderLoaded: function () {
    var staff = this.state.staffs.findById(this.props.employer.staff_id) || {};

    return (
      <div className="panel-heading">
        <h1 className="panel-title">
          <span className="pull-right text-muted">{staff.name}</span>
          <LinkToIf name={this.props.employer.name} href={this.props.employer.href} />
        </h1>
      </div>
    )
  }
});
