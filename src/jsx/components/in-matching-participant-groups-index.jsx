var InMatchingParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {
    var participantsPromise =
      this.loadResource("inMatchingParticipantGroups")()
      .then(this.extractIds("participant_group_id"))
      .then(this.loadResource("participantGroups"))
      .then(this.extractIds("participant_ids"))
      .then(this.loadResource("participants"));

    this.loadAll([
      this.loadResource("employer")(),
      participantsPromise,
      this.loadResource("enrollments")(),
      this.loadResource("programs")()
    ])
    .then(function () {
      this.setProps({
        allInMatchingParticipantGroups: this.state.inMatchingParticipantGroups
      });
    }.bind(this)).done();
  },

  renderLoaded: function () {
    var inMatchingParticipantGroupsLink = this.linkState("inMatchingParticipantGroups");

    return (
      <div className="row">
        <div className="col-md-3">
        </div>
        <div className="col-md-9">
          <InMatchingParticipantGroups
            inMatchingParticipantGroupsLink={inMatchingParticipantGroupsLink}
            participantGroups={this.state.participantGroups}
            participants={this.state.participants}
            programs={this.state.programs}
            enrollments={this.state.enrollments} />
        </div>
      </div>
    )
  },

  render: function () {
    return this.waitForLoadAll(this.renderLoaded);
  }
});

var InMatchingParticipantGroups = React.createClass({
  propTypes: {
    inMatchingParticipantGroupsLink: React.PropTypes.object.isRequired
  },

  render: function () {
    var inMatchingParticipantGroupPanels = this.props.inMatchingParticipantGroupsLink.value.map(function (inMatchingParticipantGroup) {
          var participantGroup = this.props.participantGroups.findById(inMatchingParticipantGroup.participant_group_id),
              participants = this.props.participants.findById(participantGroup.participant_ids),
              program = this.props.programs.findById(participants[0].program_id),
              enrollment = this.props.enrollments.findById(program.id, "program_id");

          return <InMatchingParticipantGroupPanel
                  inMatchingParticipantGroup={inMatchingParticipantGroup}
                  participantGroup={participantGroup}
                  participants={participants}
                  program={program}
                  enrollment={enrollment}
                  key={inMatchingParticipantGroup.id} />;
        }.bind(this));

    return (
      <div id="participant-group-panels">
        {inMatchingParticipantGroupPanels}
      </div>
    )
  }
});
