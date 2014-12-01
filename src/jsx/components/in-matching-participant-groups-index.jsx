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
          {this.state.programs.map(function (program) {
            return (
              <div className="programs">
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
