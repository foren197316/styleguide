var InMatchingParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {
      genders: [
        { id: "Female", name: "Female" },
        { id: "Male", name: "Male" }
      ]
    };
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
      this.loadResource("programs")(),
      this.loadResource("positions")()
    ])
    .done(function () {
      this.setProps({
        inMatchingParticipantGroups: this.state.inMatchingParticipantGroups,
        participantGroups: this.state.participantGroups,
        enrollments: this.state.enrollments,
        programs: this.state.programs,
        positions: this.state.positions,
        genders: this.state.genders
      });
    }.bind(this));
  },

  renderLoaded: function () {
    var inMatchingParticipantGroupsLink = this.linkState("inMatchingParticipantGroups");

    return (
      <div className="row">
        <div className="col-md-3">
          <CheckBoxFilter title="Positions" options={this.props.positions} dataLink={this.linkState("positions")} />
          <CheckBoxFilter title="Gender" options={this.props.genders} dataLink={this.linkState("genders")} />
        </div>
        <div className="col-md-9">
          {this.state.programs.map(function (program) {
            return (
              <div className="programs" key={"in_matching_participant_group_program_"+program.id}>
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="page-header">{program.name}</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <InMatchingParticipantGroups
                      inMatchingParticipantGroupsLink={inMatchingParticipantGroupsLink}
                      participantGroups={this.state.participantGroups}
                      participants={this.state.participants}
                      program={program}
                      positions={this.state.positions}
                      genders={this.state.genders}
                      employer={this.state.employer}
                      enrollments={this.state.enrollments} />
                  </div>
                </div>
              </div>
            )
          }.bind(this))}
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
    var program = this.props.program,
        employer = this.props.employer,
        enrollment = this.props.enrollments.findById(program.id, "program_id"),
        inMatchingParticipantGroupPanels = null;

        if (enrollment !== null && enrollment.searchable) {
          inMatchingParticipantGroupPanels = this.props.inMatchingParticipantGroupsLink.value.map(function (inMatchingParticipantGroup) {
            var participantGroup = this.props.participantGroups.findById(inMatchingParticipantGroup.participant_group_id);

            if (participantGroup === undefined) {
              return;
            }

            var participants = this.props.participants.filter(function (participant) {
                  return participant.program_id === program.id;
                }).findById(participantGroup.participant_ids),
                regions = participants.map(function (participant) {
                  return participant.region_ids;
                }).flatten();

            if (regions.indexOf(employer.region_id) >= 0) {
              var participantGroupParticipants = participants.findById(participantGroup.participant_ids),
                  participantGroupParticipantPositionIds = participantGroupParticipants.mapAttribute("position_ids").flatten();

              if (!participantGroupParticipantPositionIds.intersects(this.props.positions.mapAttribute("id"))) {
                return;
              }

              var participantGenders = participantGroupParticipants.mapAttribute("gender");

              if (!this.props.genders.mapAttribute("id").intersects(participantGenders)) {
                return;
              }

              return <InMatchingParticipantGroupPanel
                      inMatchingParticipantGroup={inMatchingParticipantGroup}
                      participantGroup={participantGroup}
                      participants={participants}
                      program={program}
                      enrollment={enrollment}
                      key={inMatchingParticipantGroup.id} />;
            }
          }.bind(this));
        }

    return (
      <div id="participant-group-panels">
        {inMatchingParticipantGroupPanels}
      </div>
    )
  }
});
