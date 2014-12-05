var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {};
  },

  setParticipantNames: function (offeredParticipantGroups) {
    var offeredParticipantGroupsWithNames = offeredParticipantGroups.map(function (offeredParticipantGroup) {
      offeredParticipantGroup.participant_names = offeredParticipantGroup.participants.mapAttribute("name").join(",");

      return offeredParticipantGroup;
    });

    this.setState({
      offeredParticipantGroups: offeredParticipantGroupsWithNames
    });
  },

  setInitialData: function () {
    this.setProps({
      offeredParticipantGroups: this.state.offeredParticipantGroups
    });
  },

  componentDidMount: function() {
    this.loadAll([
      this.loadResource("offeredParticipantGroups")()
      .then(this.setParticipantNames)
    ])
    .done(this.setInitialData);
  },

  renderLoaded: function () {
    var dataLink = this.linkState("offeredParticipantGroups");

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="offered_names" searchOn="participant_names" options={this.props.offeredParticipantGroups} dataLink={dataLink} />
          <RadioGroupFilter data={this.props.offeredParticipantGroups} dataLink={dataLink} filteredAttributeKey="program" />
          <RadioGroupFilter data={this.props.offeredParticipantGroups} dataLink={dataLink} filteredAttributeKey="staff" presentationName="coordinator" />
          <RadioGroupFilter data={this.props.offeredParticipantGroups} dataLink={dataLink} filteredAttributeKey="employer" />
        </div>
        <div className="col-md-9">
          <OfferedParticipantGroups dataLink={dataLink} />
        </div>
      </div>
    )
  },

  render: function() {
    return this.waitForLoadAll(this.renderLoaded);
  }
});

var OfferedParticipantGroups = React.createClass({
  propTypes: {
    dataLink: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div id="participant-group-panels">
        {this.props.dataLink.value.map(function (group) {
          return <OfferedParticipantGroupPanel data={group} key={group.id} />;
        })}
      </div>
    )
  }
});
