var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return { data: null };
  },

  componentDidMount: function() {
    if (this.props.initialData == undefined) {
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
            <OfferedParticipantGroupsProgramFilter dataState={dataState} data={this.props.initialData} program={this.props.program} />
            <OfferedParticipantGroupsStaffFilter dataState={dataState} data={this.props.initialData} staff={this.props.staff} />
            <OfferedParticipantGroupsEmployerFilter dataState={dataState} data={this.props.initialData} employer={this.props.employer} />
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
        <OfferedParticipantGroupPanel data={group} key={group.id} />
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
    var totalCount = 0,
        noCoordinatorCount = 0,
        staffOptions = this.props.data.reduce(function (prev, curr) {
          totalCount++;

          if (curr.staff != undefined) {
            for (var i=0; i<prev.length; i++) {
              if (prev[i].id === curr.staff.id) {
                prev[i].count++;
                return prev;
              }
            }
            var currCopy = curr.staff;
            currCopy.count = 1;
            prev.push(currCopy);
          } else {
            noCoordinatorCount++;
          }
          return prev;
        }, []).map(function (staff) {
          return (
            <label className="list-group-item" key={staff.id}>
              <input type="radio" name="staff" value={staff.id} />
              {staff.name}
              <span className="badge">{staff.count}</span>
            </label>
          )
        }),
        noCoordinatorRadio = function () {
          if (noCoordinatorCount > 0) {
            return (
              <label className="list-group-item">
                <input type="radio" name="staff" value="-1" />
                No Coordinator
                <span className="badge">{noCoordinatorCount}</span>
              </label>
            )
          }
        }();

    return (
      <div name="staff" className="list-group" onChange={this.handleChange}>
        <label className="list-group-item">
          <input type="radio" name="staff" value="" defaultChecked />
          All Coordinators
          <span className="badge">{totalCount}</span>
        </label>
        {staffOptions}
        {noCoordinatorRadio}
      </div>
    )
  }
});

var OfferedParticipantGroupsEmployerFilter = React.createClass({
  handleChange: function (event) {
    var employerId = event.target.value,
        groupPanels = this.props.data.filter(function (offeredParticipantGroup) {
          if (employerId === "") {
            return true;
          } else if (employerId === "-1" && offeredParticipantGroup.employer === null) {
            return true;
          } else if (offeredParticipantGroup.employer !== null && parseInt(offeredParticipantGroup.employer.id) === parseInt(employerId)) {
            return true;
          }

          return false;
        });

    this.props.dataState.requestChange(groupPanels);
  },

  render: function () {
    var totalCount = 0,
        noCoordinatorCount = 0,
        employerOptions = this.props.data.reduce(function (prev, curr) {
          totalCount++;

          if (curr.employer != undefined) {
            for (var i=0; i<prev.length; i++) {
              if (prev[i].id === curr.employer.id) {
                prev[i].count++;
                return prev;
              }
            }
            var currCopy = curr.employer;
            currCopy.count = 1;
            prev.push(currCopy);
          } else {
            noCoordinatorCount++;
          }
          return prev;
        }, []).map(function (employer) {
          return (
            <label className="list-group-item" key={employer.id}>
              <input type="radio" name="employer" value={employer.id} />
              {employer.name}
              <span className="badge">{employer.count}</span>
            </label>
          )
        }),
        noCoordinatorRadio = function () {
          if (noCoordinatorCount > 0) {
            return (
              <label className="list-group-item">
                <input type="radio" name="employer" value="-1" />
                No Coordinator
                <span className="badge">{noCoordinatorCount}</span>
              </label>
            )
          }
        }();

    return (
      <div name="employer" className="list-group" onChange={this.handleChange}>
        <label className="list-group-item">
          <input type="radio" name="employer" value="" defaultChecked />
          All Employers
          <span className="badge">{totalCount}</span>
        </label>
        {employerOptions}
        {noCoordinatorRadio}
      </div>
    )
  }
});

var OfferedParticipantGroupsProgramFilter = React.createClass({
  handleChange: function (event) {
    var programId = event.target.value,
        groupPanels = this.props.data.filter(function (offeredParticipantGroup) {
          if (programId === "") {
            return true;
          } else if (programId === "-1" && offeredParticipantGroup.program === null) {
            return true;
          } else if (offeredParticipantGroup.program !== null && parseInt(offeredParticipantGroup.program.id) === parseInt(programId)) {
            return true;
          }

          return false;
        });

    this.props.dataState.requestChange(groupPanels);
  },

  render: function () {
    var totalCount = 0,
        noCoordinatorCount = 0,
        programOptions = this.props.data.reduce(function (prev, curr) {
          totalCount++;

          if (curr.program != undefined) {
            for (var i=0; i<prev.length; i++) {
              if (prev[i].id === curr.program.id) {
                prev[i].count++;
                return prev;
              }
            }
            var currCopy = curr.program;
            currCopy.count = 1;
            prev.push(currCopy);
          } else {
            noCoordinatorCount++;
          }
          return prev;
        }, []).map(function (program) {
          return (
            <label className="list-group-item" key={program.id}>
              <input type="radio" name="program" value={program.id} />
              {program.name}
              <span className="badge">{program.count}</span>
            </label>
          )
        }),
        noCoordinatorRadio = function () {
          if (noCoordinatorCount > 0) {
            return (
              <label className="list-group-item">
                <input type="radio" name="program" value="-1" />
                No Coordinator
                <span className="badge">{noCoordinatorCount}</span>
              </label>
            )
          }
        }();

    return (
      <div name="program" className="list-group" onChange={this.handleChange}>
        <label className="list-group-item">
          <input type="radio" name="program" value="" defaultChecked />
          All Programs
          <span className="badge">{totalCount}</span>
        </label>
        {programOptions}
        {noCoordinatorRadio}
      </div>
    )
  }
});
