/* @flow */
'use strict';
let React = require('react/addons');
let Reflux = require('reflux');
let { JobOfferGroupActions } = require('../actions');

let AjaxSearchForm = React.createFactory(require('./AjaxSearchForm'));
let AjaxSearchFilter = React.createFactory(require('./AjaxSearchFilter'));
let AjaxCheckBoxFilter = React.createFactory(require('./AjaxCheckBoxFilter'));
let JobOfferGroupsPanel = React.createFactory(require('./JobOfferGroupsPanel'));
let ExportButton = React.createFactory(require('./ExportButton'));

let JobOfferSignedStore = require('../stores/JobOfferSignedStore');
let ProgramStore = require('../stores/ProgramStore');
let EmployerStore = require('../stores/EmployerStore');
let StaffStore = require('../stores/StaffStore');
let JobOfferGroupStore = require('../stores/JobOfferGroupStore');
let { div } = React.DOM;

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
      div({className: 'row'},
        div({className: 'col-md-3'},
          AjaxSearchForm({ actions: JobOfferGroupActions, formSending },
            AjaxSearchFilter({title: 'Search', searchOn: 'name'}),
            AjaxCheckBoxFilter({title: 'Participant Agreement', fieldName: 'participant_agreement', store: JobOfferSignedStore}),
            AjaxCheckBoxFilter({title: 'Program', fieldName: 'program_id', store: ProgramStore}),
            AjaxCheckBoxFilter({title: 'Employer', fieldName: 'participant_agreement_employer_id', store: EmployerStore}),
            AjaxCheckBoxFilter({title: 'Coordinator', fieldName: 'staff_id', store: StaffStore})
          ),
          ExportButton({url: this.props.exportUrl, ids: jobOfferIds})
        ),
        div({className: 'col-md-9'},
          JobOfferGroupsPanel()
        )
      )
    );
  }
});

module.exports = JobOfferGroupsIndex;
