var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return { data: null };
  },

  componentDidMount: function() {
    if (! this.props.initialData) {
      $.get(this.props.source, function(data) {
        if (this.isMounted()) {
          this.setProps({
            initialData: data.offered_participant_groups
          });

          this.setState({
            data: data.offered_participant_groups
          });
        }
      }.bind(this));
    }
  },

  render: function() {
    if (this.state.data && this.isMounted()) {
      var dataState = this.linkState('data');

      return (
        <div className="row">
          <div className="col-md-3">
            <OfferedParticipantGroupsStaffFilter dataState={dataState} data={this.props.initialData} staff={this.props.staff} />
          </div>
          <div className="col-md-9">
            <OfferedParticipantGroups dataState={dataState} />
          </div>
        </div>
      );
    } else {
      return <Spinner />
    };
  }
});

var OfferedParticipantGroups = React.createClass({
  render: function () {
    var groupPanels = this.props.dataState.value.map(function (group) {
      return (
        <OfferedParticipantGroupPanel data={group} />
      )
    });

    return (
      <div id="participant-group-panels">
        {groupPanels}
      </div>
    )
  }
});

var OfferedParticipantGroupsStaffFilter = React.createClass({
  handleChange: function (event) {
    var staffId = event.target.value,
        groupPanels = this.props.data.filter(function (offeredParticipantGroup) {
          if (staffId === "") {
            return true;
          } else if (staffId === "-1" && offeredParticipantGroup.staff === null) {
            return true;
          } else if (offeredParticipantGroup.staff !== null && parseInt(offeredParticipantGroup.staff.id) === parseInt(staffId)) {
            return true;
          }

          return false;
        });

    this.props.dataState.requestChange(groupPanels);
  },

  render: function () {
    var staffOptions = this.props.data.filter(function (offeredParticipantGroup) {
          return offeredParticipantGroup.staff != undefined;
        }).map(function (offeredParticipantGroup) {
          var staff = offeredParticipantGroup.staff;

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
