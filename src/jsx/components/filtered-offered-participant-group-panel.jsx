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
            <OfferedParticipantGroupsProgramFilter dataState={dataState} data={this.props.initialData} />
            <OfferedParticipantGroupsStaffFilter dataState={dataState} data={this.props.initialData} />
            <OfferedParticipantGroupsEmployerFilter dataState={dataState} data={this.props.initialData} />
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
  mixins: [RadioGroupFilterMixin],
  filteredAttributeKey: "staff",
  presentationName: "coordinator"
});

var OfferedParticipantGroupsEmployerFilter = React.createClass({
  mixins: [RadioGroupFilterMixin],
  filteredAttributeKey: "employer"
});

var OfferedParticipantGroupsProgramFilter = React.createClass({
  mixins: [RadioGroupFilterMixin],
  filteredAttributeKey: "program"
});
