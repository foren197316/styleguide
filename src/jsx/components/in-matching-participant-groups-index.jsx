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

  // getProgramCache: function (program) {
    // var employer = this.state.employer,
        // enrollments = this.state.enrollments,
        // enrollmentsLink = this.linkState("enrollments"),
        // enrollment = enrollments.findById(program.id, "program_id"),
        // inMatchingParticipantGroupPanels = null,
        // participantCount = 0,
        // programParticipants = this.state.participants.filter(function (participant) {
                                // return participant.program_id === program.id;
                              // });

    // inMatchingParticipantGroupPanels = this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
      // var participantGroup = this.state.participantGroups.findById(inMatchingParticipantGroup.participant_group_id);

      // if (participantGroup === undefined || participantGroup === null) {
        // return;
      // }

      // if (this.state.participantGroupNames.mapAttribute("name").indexOf(participantGroup.name) < 0) {
        // return;
      // }

      // var participantGroupParticipants = programParticipants.findById(participantGroup.participant_ids),
          // participantGroupParticipantPositionIds = participantGroupParticipants.mapAttribute("position_ids").flatten();

      // if (!participantGroupParticipantPositionIds.intersects(this.state.positions.mapAttribute("id"))) {
        // return;
      // }

      // var participantGenders = participantGroupParticipants.mapAttribute("gender");

      // if (!this.state.genders.mapAttribute("id").intersects(participantGenders)) {
        // return;
      // }

      // if (this.state.ageAtArrival.length === 1) {
        // var meetsAgeRequirement;

        // if (this.state.ageAtArrival[0].id === "21_and_over") {
          // meetsAgeRequirement = participantGroupParticipants.reduce(function (prev, curr) {
            // return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) >= 21;
          // }, false);
        // } else {
          // meetsAgeRequirement = participantGroupParticipants.reduce(function (prev, curr) {
            // return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) < 21;
          // }, false);
        // }

        // if (! meetsAgeRequirement) {
          // return;
        // }
      // }

      // var participantCountries = participantGroupParticipants.mapAttribute("country_name");

      // if (!this.state.countries.mapAttribute("name").intersects(participantCountries)) {
        // return;
      // }

      // var participantEnglishLevels = participantGroupParticipants.mapAttribute("english_level");

      // if (!this.state.englishLevels.mapAttribute("id").intersects(participantEnglishLevels)) {
        // return;
      // }

      // participantCount += participantGroupParticipants.length;

      // return <InMatchingParticipantGroupPanel
                // employer={employer}
                // enrollment={enrollment}
                // enrollments={enrollments}
                // enrollmentsLink={enrollmentsLink}
                // inMatchingParticipantGroup={inMatchingParticipantGroup}
                // key={inMatchingParticipantGroup.id}
                // participantGroup={participantGroup}
                // participants={participantGroupParticipants}
                // program={program} />;
    // }.bind(this)).notEmpty();

    // if (inMatchingParticipantGroupPanels.length > 0) {
      // return {
        // program: program,
        // inMatchingParticipantGroupPanels: inMatchingParticipantGroupPanels,
        // participantCount: participantCount
      // }
    // }
  // },

  renderLoaded: function () {
    var employer = this.state.employer[0];
    var programIds = this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
      return inMatchingParticipantGroup.participant_group.participants[0].program_id;
    }).sort().uniq();

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn="participant_names" store={InMatchingParticipantGroupStore} actions={InMatchingParticipantGroupActions} />
          <CheckBoxFilter title="Age at Arrival" store={AgeAtArrivalStore} actions={AgeAtArrivalActions} />
          <CheckBoxFilter title="Group" store={ParticipantGroupNameStore} actions={ParticipantGroupNameActions} />
          <CheckBoxFilter title="Gender" store={GenderStore} actions={GenderActions} />
          <CheckBoxFilter title="English Level" store={EnglishLevelStore} actions={EnglishLevelActions} />
          <DateRangeFilter searchFrom="start_dates" searchTo="finish_dates" actions={InMatchingParticipantGroupActions} />
          <CheckBoxFilter title="Positions" store={PositionStore} actions={PositionActions} />
          <CheckBoxFilter title="Country" store={CountryStore} actions={CountryActions} />
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
