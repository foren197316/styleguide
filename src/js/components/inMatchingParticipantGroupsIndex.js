/** @jsx React.DOM */
var InMatchingParticipantGroupsIndex = React.createClass({displayName: 'InMatchingParticipantGroupsIndex',
  mixins: [
    Reflux.connect(InMatchingParticipantGroupStore, "inMatchingParticipantGroups"),
    Reflux.connect(EmployerStore, "employer"),
    Reflux.connect(ProgramStore, "programs"),
    RenderLoadedMixin("inMatchingParticipantGroups", "employer", "programs")
  ],

  statics: {
    noResultsMessage: "There are currently no participants available who match your criteria. Check back soon!"
  },

  componentDidMount: function() {
    this.intercomListener = this.listenTo(EmployerStore, this.intercom);
    window.RESOURCE_URLS = this.props.urls;
    InMatchingParticipantGroupActions.ajaxLoad(GlobalActions.loadFromInMatchingParticipantGroups);
    EmployerActions.ajaxLoadSingleton();
    PositionActions.ajaxLoad();
    ProgramActions.ajaxLoad();
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
      return inMatchingParticipantGroup.participants[0].program_id;
    }).sort().uniq();

    return (
      React.DOM.div({className: "row"},
        React.DOM.div({className: "col-md-3"},
          SearchFilter({title: "Search", searchOn: "participant_names", actions: InMatchingParticipantGroupActions}),
          CheckBoxFilter({title: "Age at Arrival", store: AgeAtArrivalStore, actions: AgeAtArrivalActions}),
          CheckBoxFilter({title: "Group", store: ParticipantGroupNameStore, actions: ParticipantGroupNameActions}),
          CheckBoxFilter({title: "Gender", store: GenderStore, actions: GenderActions}),
          CheckBoxFilter({title: "English Level", store: EnglishLevelStore, actions: EnglishLevelActions}),
          DateRangeFilter({searchFrom: "participant_start_dates", searchTo: "participant_finish_dates", actions: InMatchingParticipantGroupActions}),
          CheckBoxFilter({title: "Positions", store: PositionStore, actions: PositionActions}),
          CheckBoxFilter({title: "Country", store: CountryStore, actions: CountryActions}),
          BooleanFilter({title: "Previous Participation", label: "Returning Participant", action: InMatchingParticipantGroupActions.togglePreviousParticipation}),
          BooleanFilter({title: "Drivers License", label: "International Drivers License", action: InMatchingParticipantGroupActions.toggleInternationalDriversLicense})
        ),
        React.DOM.div({className: "col-md-9"},
          function () {
            if (programIds.length > 0) {
              return programIds.map(function (programId) {
                var program = this.state.programs.findById(programId);
                var enrollment = employer.enrollments.findById(program.id, "program_id");
                var participantCount = 0;
                var inMatchingParticipantGroups = this.state.inMatchingParticipantGroups.filter(function (inMatchingParticipantGroup) {
                  if (inMatchingParticipantGroup.participants[0].program_id === program.id) {
                    participantCount += inMatchingParticipantGroup.participants.length;
                    return true;
                  }
                  return false;
                });

                return (
                  React.DOM.div({className: "programs", key: "in_matching_participant_group_program_"+program.id},
                    React.DOM.div({className: "row"},
                      React.DOM.div({className: "col-md-12"},
                        React.DOM.h2({className: "page-header"},
                          program.name,
                          React.DOM.small({className: "pull-right"}, participantCount, " Participants")
                        )
                      )
                    ),
                    React.DOM.div({className: "row"},
                      React.DOM.div({className: "col-md-12"},
                        React.DOM.div({id: "participant-group-panels"},
                          inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
                            return InMatchingParticipantGroupPanel({
                                      employer: employer,
                                      enrollment: enrollment,
                                      inMatchingParticipantGroup: inMatchingParticipantGroup,
                                      key: inMatchingParticipantGroup.id});
                          })
                        )
                      )
                    )
                  )
                )
              }.bind(this));
            } else {
              return Alert({type: "warning", message: InMatchingParticipantGroupsIndex.noResultsMessage, closeable: false})
            }
          }.bind(this)()
        )
      )
    )
  }
});
