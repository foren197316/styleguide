/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let actions = require('../actions');
let mixins = require('../mixins');
let SearchFilter = require('./SearchFilter');
let CheckBoxFilter = require('./CheckBoxFilter');
let OfferedParticipantGroupStore = require('../stores/OfferedParticipantGroupStore');
let ProgramStore = require('../stores/ProgramStore');
let PositionStore = require('../stores/PositionStore');
let EmployerStore = require('../stores/EmployerStore');
let StaffStore = require('../stores/StaffStore');
let OfferedParticipantGroupPanel = require('./OfferedParticipantGroupPanel');

module.exports = React.createClass({displayName: 'OfferedParticipantGroupsIndex',
  mixins: [
    Reflux.connect(OfferedParticipantGroupStore, 'offeredParticipantGroups'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    mixins.RenderLoadedMixin('offeredParticipantGroups', 'programs', 'positions', 'staffs', 'employers')
  ],

  componentDidMount: function() {
    actions.OfferedParticipantGroupActions.ajaxLoad(actions.loadFromOfferedParticipantGroups);
    actions.PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          React.createElement(SearchFilter, {title: 'offered_names', searchOn: ['participant_names', 'participant_emails', 'participant_uuids'], store: OfferedParticipantGroupStore, actions: actions.OfferedParticipantGroupActions}),
          React.createElement(CheckBoxFilter, {title: 'Program', store: ProgramStore, actions: actions.ProgramActions}),
          React.createElement(CheckBoxFilter, {title: 'Coordinator', store: StaffStore, actions: actions.StaffActions}),
          React.createElement(CheckBoxFilter, {title: 'Employer', store: EmployerStore, actions: actions.EmployerActions})
        ),
        React.DOM.div({className: 'col-md-9'},
          React.DOM.div({id: 'participant-group-panels'},
            this.state.programs.map(function (program, loopIndex) {
              var programOfferedParticipantGroups = this.state.offeredParticipantGroups.filter(function (offeredParticipantGroup) {
                return offeredParticipantGroup.participants[0].program_id === program.id;
              });

              if (programOfferedParticipantGroups.length === 0) {
                return null;
              } else {
                return (
                  React.DOM.div({key: 'offered_header_'+loopIndex},
                    React.DOM.h2({className: 'page-header'},
                      program.name,
                      React.DOM.small({className: 'pull-right'}, programOfferedParticipantGroups.mapAttribute('draft_job_offers').flatten().mapAttribute('participant_ids').flatten().length, ' Offered')
                    ),

                    programOfferedParticipantGroups.map(function (offeredParticipantGroup) {
                      return React.createElement(OfferedParticipantGroupPanel, {offeredParticipantGroup: offeredParticipantGroup, key: 'offered_participant_group_'+offeredParticipantGroup.id});
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
