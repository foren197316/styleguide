/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let {
  JobOfferGroupActions,
  JobOfferSignedActions,
  ProgramActions,
  EmployerActions,
  StaffActions
} = require('../actions');
let AjaxSearchFilter = React.createFactory(require('./SearchFilter'));
let AjaxCheckBoxFilter = React.createFactory(require('./CheckBoxFilter'));
let JobOfferGroupsPanel = React.createFactory(require('./JobOfferGroupsPanel'));
let JobOfferSignedStore = require('../stores/JobOfferSignedStore');
let ProgramStore = require('../stores/ProgramStore');
let EmployerStore = require('../stores/EmployerStore');
let StaffStore = require('../stores/StaffStore');
let JobOfferGroupStore = require('../stores/JobOfferGroupStore');
let ExportButton = React.createFactory(require('./ExportButton'));
let AjaxSearchForm = require('./AjaxSearchForm');

let JobOfferGroupsIndex = React.createClass({displayName: 'JobOfferGroupsIndex',
  mixins: [
    React.addons.LinkedStateMixin,
    Reflux.connect(JobOfferGroupStore, 'jobOfferGroups')
  ],

  propTypes: {
    exportUrl: React.PropTypes.string.isRequired
  },

  getInitialState () {
    return {
      formSending: false
    };
  },

  render () {
    let formSending = this.linkState('formSending');
    let jobOfferIds = this.state.jobOfferGroups ?
      this.state.jobOfferGroups.mapAttribute('job_offers').flatten().mapAttribute('id') :
      [];

    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          AjaxSearchForm({ actions: JobOfferGroupActions, formSending },
            AjaxSearchFilter({title: 'Search', searchOn: 'participant_names', actions: JobOfferGroupActions}),
            AjaxCheckBoxFilter({title: 'Participant Agreement', store: JobOfferSignedStore, actions: JobOfferSignedActions}),
            AjaxCheckBoxFilter({title: 'Program', store: ProgramStore, actions: ProgramActions}),
            AjaxCheckBoxFilter({title: 'Employer', store: EmployerStore, actions: EmployerActions}),
            AjaxCheckBoxFilter({title: 'Coordinator', store: StaffStore, actions: StaffActions}),
            ExportButton({url: this.props.exportUrl, ids: jobOfferIds})
          )
        ),
        React.DOM.div({className: 'col-md-9'},
          JobOfferGroupsPanel()
        )
      )
    );
  }
});

module.exports = JobOfferGroupsIndex;
