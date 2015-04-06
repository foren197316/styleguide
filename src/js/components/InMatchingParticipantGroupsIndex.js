/* @flow */
'use strict';

let React = require('react/addons');
let Alert = React.createFactory(require('./Alert'));
let InMatchingParticipantGroupPanel = React.createFactory(require('./InMatchingParticipantGroupPanel'));
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
let LoadingStore = require('../stores/LoadingStore');
let ParticipantGroupNameStore = require('../stores/ParticipantGroupNameStore');
let PositionStore = require('../stores/PositionStore');
let ProgramStore = require('../stores/ProgramStore');

let AjaxBooleanFilter = React.createFactory(require('./AjaxBooleanFilter'));
let AjaxCheckBoxFilter = React.createFactory(require('./AjaxCheckBoxFilter'));
let AjaxCustomCheckBoxFilter = React.createFactory(require('./AjaxCustomCheckBoxFilter'));
let AjaxDateRangeFilter = React.createFactory(require('./AjaxDateRangeFilter'));
let AjaxSearchFilter = React.createFactory(require('./AjaxSearchFilter'));
let AjaxSearchForm = React.createFactory(require('./AjaxSearchForm'));

let Pagination = React.createFactory(require('./Pagination'));
let Spinner = React.createFactory(require('./Spinner'));
let query = require('../query');

let { div, a } = React.DOM;

var InMatchingParticipantGroupsIndex = React.createClass({
  displayName: 'InMatchingParticipantGroupsIndex',
  mixins: [
    Reflux.connect(InMatchingParticipantGroupStore, 'inMatchingParticipantGroups'),
    Reflux.connect(EmployerStore, 'employer'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(MetaStore, 'meta'),
    Reflux.connect(LoadingStore, 'isLoading'),
    RenderLoadedMixin('inMatchingParticipantGroups', 'employer', 'programs', 'meta'),
  ],

  noResultsMessage: 'There are currently no participants available who match your criteria. Check back soon!',

  getInitialState () {
    return {
      isLoading: false
    };
  },

  componentDidMount () {
    this.intercomListener = this.listenTo(EmployerStore, this.intercom);

    actions.InMatchingParticipantGroupActions.ajaxSearch(query.getQuery());
    actions.EmployerActions.ajaxLoadSingleton();
    actions.PositionActions.ajaxLoad();
    actions.ProgramActions.ajaxLoad();
    actions.CountryActions.ajaxLoad();
  },

  intercom: function (employer) {
    this.intercomListener.stop();

    global.Intercom('trackEvent', 'visited-employer-participants-search', {
      employer_id: employer.id,
      employer_name: employer.name
    });
  },

  renderLoaded () {
    let employer = this.state.employer;
    let page = query.getCurrentPage();
    let pageCount = this.state.meta.pageCount;
    let recordCount = this.state.meta.recordCount;
    let recordName = 'Participant';
    let anchor = 'searchTop';

    return (
      div({className: 'row'},
        div({className: 'col-md-3'},
          AjaxSearchForm({ actions: actions.InMatchingParticipantGroupActions },
            AjaxSearchFilter({title: 'Search', searchOn: 'name'}),
            AjaxCheckBoxFilter({title: 'Program', fieldName: 'program_id', store: ProgramStore}),
            AjaxCustomCheckBoxFilter({title: 'Age at Arrival', fieldName: 'age_at_arrival', store: AgeAtArrivalStore}),
            AjaxCheckBoxFilter({title: 'Group', fieldName: 'participant_group_name', store: ParticipantGroupNameStore}),
            AjaxCheckBoxFilter({title: 'Gender', fieldName: 'gender', store: GenderStore}),
            AjaxCheckBoxFilter({title: 'English Level', fieldName: 'english_level', store: EnglishLevelStore}),
            AjaxDateRangeFilter({title: 'Availability Date', searchFrom: 'arrival_date_plus_two', searchTo: 'departure_date'}),
            AjaxCheckBoxFilter({title: 'Positions', fieldName: 'position_ids', predicate: 'in_overlap', store: PositionStore}),
            AjaxCheckBoxFilter({title: 'Country', fieldName: 'country_code', store: CountryStore}),
            AjaxBooleanFilter({title: 'Previous Participation', label: 'Returning Participant', fieldName: 'has_had_j1', bool: true}),
            AjaxBooleanFilter({title: 'Drivers License', label: 'International Drivers License', fieldName: 'has_international_drivers_license', bool: true})
          )
        ),
        div({className: 'col-md-9'},
          a({name: anchor}),
          (() => {
            if (this.state.isLoading) {
              return Spinner();
            } else if (this.state.inMatchingParticipantGroups.length > 0) {
              return (
                div({},
                  div({className: 'row'},
                    div({className: 'col-md-12'},
                      Pagination({ pageCount, recordCount, page, actions: actions.InMatchingParticipantGroupActions, recordName })
                    )
                  ),
                  div({className: 'row'},
                    div({className: 'col-md-12'},
                      div({id: 'participant-group-panels'},
                        this.state.inMatchingParticipantGroups.map((inMatchingParticipantGroup, key) => {
                          let program = this.state.programs.findById(inMatchingParticipantGroup.participants[0].program_id);
                          let enrollment = employer.enrollments.findById(program.id, 'program_id');
                          return InMatchingParticipantGroupPanel({ employer, enrollment, inMatchingParticipantGroup, program, key });
                        })
                      )
                    )
                  ),
                  div({className: 'row'},
                    div({className: 'col-md-12'},
                      Pagination({ pageCount, recordCount, page, anchor, actions: actions.InMatchingParticipantGroupActions, recordName })
                    )
                  )
                )
              );
            } else {
              return Alert({type: 'warning', message: this.noResultsMessage, closeable: false});
            }
          })()
        )
      )
    );
  }
});

module.exports = InMatchingParticipantGroupsIndex;
