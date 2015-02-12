'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var actions = require('../actions');
var mixins = require('../mixins');
var SearchFilter = require('./SearchFilter');
var CheckBoxFilter = require('./CheckBoxFilter');
var OfferedParticipantGroupStore = require('../stores/OfferedParticipantGroupStore');
var ProgramStore = require('../stores/ProgramStore');
var PositionStore = require('../stores/PositionStore');
var EmployerStore = require('../stores/EmployerStore');
var StaffStore = require('../stores/StaffStore');
var OfferedParticipantGroupPanel = require('./OfferedParticipantGroupPanel');

var OfferedParticipantGroupsIndex = React.createClass({displayName: 'OfferedParticipantGroupsIndex',
  mixins: [
    Reflux.connect(OfferedParticipantGroupStore, 'offeredParticipantGroups'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    mixins.RenderLoadedMixin('offeredParticipantGroups', 'programs', 'positions', 'staffs', 'employers')
  ],

  componentDidMount: function() {
    actions.setUrls(this.props.urls);
    actions.OfferedParticipantGroupActions.ajaxLoad(actions.loadFromOfferedParticipantGroups);
    actions.PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          SearchFilter({title: 'offered_names', searchOn: ['participant_names', 'participant_emails', 'participant_uuids'], store: OfferedParticipantGroupStore, actions: actions.OfferedParticipantGroupActions}),
          CheckBoxFilter({title: 'Program', store: ProgramStore, actions: actions.ProgramActions}),
          CheckBoxFilter({title: 'Coordinator', store: StaffStore, actions: actions.StaffActions}),
          CheckBoxFilter({title: 'Employer', store: EmployerStore, actions: actions.EmployerActions})
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

module.exports = OfferedParticipantGroupsIndex;
