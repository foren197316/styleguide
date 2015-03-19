/* @flow */
'use strict';

let Alert = require('./Alert');
let InMatchingParticipantGroupPanel = require('./InMatchingParticipantGroupPanel');
let React = require('react/addons');
let Reflux = require('reflux');
let RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
let actions = require('../actions');

let AgeAtArrivalStore = require('../stores/AgeAtArrivalStore');
let CountryStore = require('../stores/CountryStore');
let EmployerStore = require('../stores/EmployerStore');
let EnglishLevelStore = require('../stores/EnglishLevelStore');
let GenderStore = require('../stores/GenderStore');
let InMatchingParticipantGroupStore = require('../stores/InMatchingParticipantGroupStore');
let MetaStore = require('../stores/MetaStore');
let ParticipantGroupNameStore = require('../stores/ParticipantGroupNameStore');
let PositionStore = require('../stores/PositionStore');
let ProgramStore = require('../stores/ProgramStore');

let AjaxBooleanFilter = require('./AjaxBooleanFilter');
let AjaxCheckBoxFilter = require('./AjaxCheckBoxFilter');
let AjaxCustomCheckBoxFilter = require('./AjaxCustomCheckBoxFilter');
let AjaxDateRangeFilter = require('./AjaxDateRangeFilter');
let AjaxSearchFilter = require('./AjaxSearchFilter');
let AjaxSearchForm = require('./AjaxSearchForm');

let Pagination = require('./Pagination');
let Spinner = require('./Spinner');
let query = require('../query');

var InMatchingParticipantGroupsIndex = React.createClass({displayName: 'InMatchingParticipantGroupsIndex',
  mixins: [
    Reflux.connect(InMatchingParticipantGroupStore, 'inMatchingParticipantGroups'),
    Reflux.connect(EmployerStore, 'employer'),
    Reflux.connect(ProgramStore, 'programs'),
    RenderLoadedMixin('inMatchingParticipantGroups', 'employer', 'programs'),
    React.addons.LinkedStateMixin
  ],

  noResultsMessage: 'There are currently no participants available who match your criteria. Check back soon!',

  getInitialState: function () {
    return { formSending: false };
  },

  componentDidMount: function() {
    this.intercomListener = this.listenTo(EmployerStore, this.intercom);
    actions.setUrls(this.props.urls);

    actions.InMatchingParticipantGroupActions.ajaxSearch(query.getQuery());
    actions.EmployerActions.ajaxLoadSingleton();
    actions.PositionActions.ajaxLoad();
    actions.ProgramActions.ajaxLoad();
    actions.CountryActions.ajaxLoad();
  },

  intercom: function (employer) {
    this.intercomListener.stop();

    require('intercom.io')('trackEvent', 'visited-employer-participants-search', {
      employer_id: employer.id,
      employer_name: employer.name
    });
  },

  renderLoaded: function () {
    var employer = this.state.employer;
    var page = query.getCurrentPage();
    var pageCount = MetaStore.data.pageCount;
    var recordCount = MetaStore.data.recordCount;
    var formSendingLink = this.linkState('formSending');
    var recordName = 'Participants';
    var anchor = 'searchTop';

    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          React.createElement(AjaxSearchForm, { actions: actions.InMatchingParticipantGroupActions, formSending: formSendingLink },
            React.createElement(AjaxSearchFilter, {title: 'Search', searchOn: 'name'}),
            React.createElement(AjaxCheckBoxFilter, {title: 'Program', fieldName: 'program_id', store: ProgramStore}),
            React.createElement(AjaxCustomCheckBoxFilter, {title: 'Age at Arrival', fieldName: 'age_at_arrival', store: AgeAtArrivalStore}),
            React.createElement(AjaxCheckBoxFilter, {title: 'Group', fieldName: 'participant_group_name', store: ParticipantGroupNameStore}),
            React.createElement(AjaxCheckBoxFilter, {title: 'Gender', fieldName: 'gender', store: GenderStore}),
            React.createElement(AjaxCheckBoxFilter, {title: 'English Level', fieldName: 'english_level', store: EnglishLevelStore}),
            React.createElement(AjaxDateRangeFilter, {title: 'Availability Date', searchFrom: 'arrival_date_plus_two', searchTo: 'departure_date'}),
            React.createElement(AjaxCheckBoxFilter, {title: 'Positions', fieldName: 'positions_id', store: PositionStore}),
            React.createElement(AjaxCheckBoxFilter, {title: 'Country', fieldName: 'country_code', store: CountryStore}),
            React.createElement(AjaxBooleanFilter, {title: 'Previous Participation', label: 'Returning Participant', fieldName: 'has_had_j1', bool: true}),
            React.createElement(AjaxBooleanFilter, {title: 'Drivers License', label: 'International Drivers License', fieldName: 'has_international_drivers_license', bool: true})
          )
        ),
        React.DOM.div({className: 'col-md-9'},
          React.DOM.a({name: anchor}),
          function () {
            if (this.state.formSending) {
              return React.createElement(Spinner, {});
            } else if (this.state.inMatchingParticipantGroups.length > 0) {
              return React.DOM.div({},
                React.DOM.div({className: 'row'},
                  React.DOM.div({className: 'col-md-12'},
                    React.createElement(Pagination, { pageCount: pageCount, recordCount: recordCount, page: page, actions: actions.InMatchingParticipantGroupActions, formSending: formSendingLink, recordName: recordName })
                  )
                ),
                React.DOM.div({className: 'row'},
                  React.DOM.div({className: 'col-md-12'},
                    React.DOM.div({id: 'participant-group-panels'},
                      this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
                        var program = this.state.programs.findById(inMatchingParticipantGroup.participants[0].program_id);
                        var enrollment = employer.enrollments.findById(program.id, 'program_id');

                        return React.createElement(InMatchingParticipantGroupPanel, {
                                  employer: employer,
                                  enrollment: enrollment,
                                  inMatchingParticipantGroup: inMatchingParticipantGroup,
                                  program: program,
                                  key: inMatchingParticipantGroup.id});
                      }, this)
                    )
                  )
                ),
                React.DOM.div({className: 'row'},
                  React.DOM.div({className: 'col-md-12'},
                    React.createElement(Pagination, { pageCount: pageCount, recordCount: recordCount, page: page, anchor: anchor, actions: actions.InMatchingParticipantGroupActions, formSending: formSendingLink, recordName: recordName })
                  )
                )
              );
            } else {
              return React.createElement(Alert, {type: 'warning', message: this.noResultsMessage, closeable: false});
            }
          }.bind(this)()
        )
      )
    );
  }
});

module.exports = InMatchingParticipantGroupsIndex;
