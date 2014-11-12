var FilterableOfferedParticipantGroupPanels = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      staffId: ""
    }
  },

  render: function () {
    var staffIdState = this.linkState('staffId');

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchOfferedParticipantGroupPanels staffIdState={staffIdState} staff={this.props.staff} />
        </div>
        <div className="col-md-9">
          <OfferedParticipantGroupPanels source={this.props.source} staffIdState={staffIdState} />
        </div>
      </div>
    )
  }
});

var SearchOfferedParticipantGroupPanels = React.createClass({
  handleChange: function (event) {
    this.props.staffIdState.requestChange(event.target.value);
  },

  render: function () {
    var staffOptions = this.props.staff.map(function (staff) {
      return (
        <label className="list-group-item" key={staff.id}>
          <input type="radio" name="staff" value={staff.id} />
          {staff.name}
        </label>
      )
    });

    return (
      <div name="staff" className="list-group" onChange={this.handleChange}>
        <label className="list-group-item">
          <input type="radio" name="staff" value="" defaultChecked />
          All Coordinators
        </label>
        {staffOptions}
        <label className="list-group-item">
          <input type="radio" name="staff" value="-1" />
          No Coordinator
        </label>
      </div>
    )
  }
});
