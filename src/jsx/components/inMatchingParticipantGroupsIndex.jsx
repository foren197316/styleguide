var InMatchingParticipantGroupsIndex = React.createClass({
  mixins: [
    Reflux.ListenerMixin,
    Reflux.connect(InMatchingParticipantGroupStore, "inMatchingParticipantGroups"),
    Reflux.connect(EmployerStore, "employer"),
    Reflux.connect(EnrollmentStore, "enrollments"),
    RenderLoadedMixin(["inMatchingParticipantGroups", "employer", "enrollments"])
  ],

  statics: {
    noResultsMessage: "There are currently no participants available who match your criteria. Check back soon!"
  },

  getInitialState: function () {
    return { inMatchingParticipantGroups: null };
  },

  componentDidMount: function() {
    this.intercomListener = this.listenTo(EmployerStore, this.intercom);
    window.RESOURCE_URLS = this.props.urls; /* TODO: I hate that you have to do this. */
    InMatchingParticipantGroupActions.ajaxLoad();
    EnrollmentActions.ajaxLoad();
    PositionActions.ajaxLoad();
  },

  intercom: function (employers) {
    this.intercomListener.stop();

    Intercom('trackEvent', 'visited-employer-participants-search', {
      employer_id: employers[0].id,
      employer_name: employers[0].name
    });
  },

  renderLoaded: function () {
    var employer = this.state.employer[0];
    var programIds = this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
      return inMatchingParticipantGroup.participant_group.participants[0].program_id;
    }).sort().uniq();

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn="participant_names" actions={InMatchingParticipantGroupActions} />
          <CheckBoxFilter title="Age at Arrival" store={AgeAtArrivalStore} actions={AgeAtArrivalActions} />
          <CheckBoxFilter title="Group" store={ParticipantGroupNameStore} actions={ParticipantGroupNameActions} />
          <CheckBoxFilter title="Gender" store={GenderStore} actions={GenderActions} />
          <CheckBoxFilter title="English Level" store={EnglishLevelStore} actions={EnglishLevelActions} />
          <DateRangeFilter searchFrom="participant_start_dates" searchTo="participant_finish_dates" actions={InMatchingParticipantGroupActions} />
          <CheckBoxFilter title="Positions" store={PositionStore} actions={PositionActions} />
          <CheckBoxFilter title="Country" store={CountryStore} actions={CountryActions} />
          <CheckBoxFilter title="Previous Participation" store={PreviousParticipationStore} actions={PreviousParticipationActions} />
          <CheckBoxFilter title="Drivers License" store={DriversLicenseStore} actions={DriversLicenseActions} />
        </div>
        <div className="col-md-9">
          {function () {
            if (programIds.length > 0) {
              return programIds.map(function (programId) {
                var program = ProgramStore.findById(programId);
                var enrollment = EnrollmentStore.findById(program.id, "program_id");
                var participantCount = 0;
                var inMatchingParticipantGroups = this.state.inMatchingParticipantGroups.filter(function (inMatchingParticipantGroup) {
                  if (inMatchingParticipantGroup.participant_group.participants[0].program_id === program.id) {
                    participantCount += inMatchingParticipantGroup.participant_group.participants.length;
                    return true;
                  }
                  return false;
                });

                return (
                  <div className="programs" key={"in_matching_participant_group_program_"+program.id}>
                    <div className="row">
                      <div className="col-md-12">
                        <h2 className="page-header">
                          {program.name}
                          <small className="pull-right">{participantCount} Participants</small>
                        </h2>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div id="participant-group-panels">
                          {inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
                            return <InMatchingParticipantGroupPanel
                                      employer={employer}
                                      enrollment={enrollment}
                                      inMatchingParticipantGroup={inMatchingParticipantGroup}
                                      key={inMatchingParticipantGroup.id} />;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }.bind(this));
            } else {
              return <Alert type="warning" message={InMatchingParticipantGroupsIndex.noResultsMessage} closeable={false} />
            }
          }.bind(this)()}
        </div>
      </div>
    )
  }
});
