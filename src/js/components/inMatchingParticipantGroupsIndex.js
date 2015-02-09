/* @flow */
'use strict';

var Reflux = require('reflux');
var React = require('react/addons');
var actions = require('../actions');
var RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
var Alert = require('./Alert');
var InMatchingParticipantGroupPanel = require('./InMatchingParticipantGroupPanel');

var InMatchingParticipantGroupStore = require('../stores/InMatchingParticipantGroupStore');
var EmployerStore = require('../stores/EmployerStore');
var ProgramStore = require('../stores/ProgramStore');
var AgeAtArrivalStore = require('../stores/AgeAtArrivalStore');
var ParticipantGroupNameStore = require('../stores/ParticipantGroupNameStore');
var GenderStore = require('../stores/GenderStore');
var EnglishLevelStore = require('../stores/EnglishLevelStore');
var PositionStore = require('../stores/PositionStore');
var CountryStore = require('../stores/CountryStore');

var AjaxSearchForm = require('./AjaxSearchForm');
var AjaxSearchFilter = require('./AjaxSearchFilter');
var AjaxCheckBoxFilter = require('./AjaxCheckBoxFilter');
var AjaxCustomCheckBoxFilter = require('./AjaxCustomCheckBoxFilter');
var AjaxBooleanFilter = require('./AjaxBooleanFilter');
var AjaxDateRangeFilter = require('./AjaxDateRangeFilter');

var Base64 = require('../base64');

var InMatchingParticipantGroupsIndex = React.createClass({displayName: 'InMatchingParticipantGroupsIndex',
  mixins: [
    Reflux.connect(InMatchingParticipantGroupStore, 'inMatchingParticipantGroups'),
    Reflux.connect(EmployerStore, 'employer'),
    Reflux.connect(ProgramStore, 'programs'),
    RenderLoadedMixin('inMatchingParticipantGroups', 'employer', 'programs')
  ],

  statics: {
    noResultsMessage: 'There are currently no participants available who match your criteria. Check back soon!'
  },

  componentDidMount: function() {
    this.intercomListener = this.listenTo(EmployerStore, this.intercom);
    actions.setUrls(this.props.urls);

    var query;
    var hash = global.location.hash;
    if (hash.length > 1) {
      try {
        query = Base64.urlsafeDecode64(hash.slice(1));
      } catch (e) {}
    }

    if (query != null) {
      actions.InMatchingParticipantGroupActions.ajaxSearch(query, actions.loadFromInMatchingParticipantGroups);
    } else {
      actions.InMatchingParticipantGroupActions.ajaxSearch(actions.loadFromInMatchingParticipantGroups);
    }

    actions.EmployerActions.ajaxLoadSingleton();
    actions.PositionActions.ajaxLoad();
    actions.ProgramActions.ajaxLoad();
    actions.CountryActions.ajaxLoad();
  },

  intercom: function (employers) {
    this.intercomListener.stop();

    require('intercom.io')('trackEvent', 'visited-employer-participants-search', {
      employer_id: employers[0].id,
      employer_name: employers[0].name
    });
  },

  renderLoaded: function () {
    var employer = this.state.employer[0];

    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          AjaxSearchForm({ url: this.props.urls.inMatchingParticipantGroups, reloadAction: InMatchingParticipantGroupStore.reload },
            AjaxSearchFilter({title: 'Search', searchOn: 'name'}),
            AjaxCustomCheckBoxFilter({title: 'Age at Arrival', fieldName: 'age_at_arrival', store: AgeAtArrivalStore}),
            AjaxCheckBoxFilter({title: 'Group', fieldName: 'participant_group_name', store: ParticipantGroupNameStore}),
            AjaxCheckBoxFilter({title: 'Gender', fieldName: 'gender', store: GenderStore}),
            AjaxCheckBoxFilter({title: 'English Level', fieldName: 'english_level', store: EnglishLevelStore}),
            AjaxDateRangeFilter({searchFrom: 'arrival_date_plus_two', searchTo: 'departure_date'}),
            AjaxCheckBoxFilter({title: 'Positions', fieldName: 'positions_id', store: PositionStore}),
            AjaxCheckBoxFilter({title: 'Country', fieldName: 'country_code', store: CountryStore}),
            AjaxBooleanFilter({title: 'Previous Participation', label: 'Returning Participant', fieldName: 'has_had_j1', bool: true}),
            AjaxBooleanFilter({title: 'Drivers License', label: 'International Drivers License', fieldName: 'has_international_drivers_license', bool: true})
          )
        ),
        React.DOM.div({className: 'col-md-9'},
          function () {
            if (this.state.inMatchingParticipantGroups.length > 0) {
              return React.DOM.div({className: 'row'},
                React.DOM.div({className: 'col-md-12'},
                  React.DOM.div({id: 'participant-group-panels'},
                    this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
                      var program = this.state.programs.findById(inMatchingParticipantGroup.participants[0].program_id);
                      var enrollment = employer.enrollments.findById(program.id, 'program_id');

                      return InMatchingParticipantGroupPanel({
                                employer: employer,
                                enrollment: enrollment,
                                inMatchingParticipantGroup: inMatchingParticipantGroup,
                                key: inMatchingParticipantGroup.id});
                    }, this)
                  )
                )
              );
            } else {
              return Alert({type: 'warning', message: InMatchingParticipantGroupsIndex.noResultsMessage, closeable: false});
            }
          }.bind(this)()
        )
      )
    );
  }
});

module.exports = InMatchingParticipantGroupsIndex;
