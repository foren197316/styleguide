/* exported OfferedParticipantGroupsIndex */

var OfferedParticipantGroupsIndex = React.createClass({displayName: 'OfferedParticipantGroupsIndex',
  mixins: [
    Reflux.connect(OfferedParticipantGroupStore, 'offeredParticipantGroups'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    RenderLoadedMixin('offeredParticipantGroups', 'programs', 'positions', 'staffs', 'employers')
  ],

  componentDidMount: function() {
    window.RESOURCE_URLS = this.props.urls;
    OfferedParticipantGroupActions.ajaxLoad(GlobalActions.loadFromOfferedParticipantGroups);
    PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          SearchFilter({title: 'offered_names', searchOn: ['participant_names', 'participant_emails', 'participant_uuids'], store: OfferedParticipantGroupStore, actions: OfferedParticipantGroupActions}),
          CheckBoxFilter({title: 'Program', store: ProgramStore, actions: ProgramActions}),
          CheckBoxFilter({title: 'Coordinator', store: StaffStore, actions: StaffActions}),
          CheckBoxFilter({title: 'Employer', store: EmployerStore, actions: EmployerActions})
        ),
        React.DOM.div({className: 'col-md-9'},
          React.DOM.div({id: 'participant-group-panels'},
            this.state.programs.map(function (program) {
              var programOfferedParticipantGroups = this.state.offeredParticipantGroups.filter(function (offeredParticipantGroup) {
                return offeredParticipantGroup.participants[0].program_id === program.id;
              });

              if (programOfferedParticipantGroups.length === 0) {
                return null;
              } else {
                return (
                  React.DOM.div(null,
                    React.DOM.h2({className: 'page-header'},
                      program.name,
                      React.DOM.small({className: 'pull-right'}, programOfferedParticipantGroups.mapAttribute('draft_job_offers').flatten().mapAttribute('participant_ids').flatten().length, ' Offered')
                    ),

                    programOfferedParticipantGroups.map(function (offeredParticipantGroup) {
                      return OfferedParticipantGroupPanel({offeredParticipantGroup: offeredParticipantGroup, key: 'offered_participant_group_'+offeredParticipantGroup.id});
                    })
                  )
                );
              }
            }, this)
          )
        )
      )
    );
  }
});
