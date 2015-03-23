/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let actions = require('../actions');
let SearchFilter = React.createFactory(require('./SearchFilter'));
let CheckBoxFilter = React.createFactory(require('./CheckBoxFilter'));
let JobOfferGroupsPanel = React.createFactory(require('./JobOfferGroupsPanel'));
let JobOfferSignedStore = require('../stores/JobOfferSignedStore');
let ProgramStore = require('../stores/ProgramStore');
let EmployerStore = require('../stores/EmployerStore');
let StaffStore = require('../stores/StaffStore');
let JobOfferGroupStore = require('../stores/JobOfferGroupStore');
let ExportButton = React.createFactory(require('./ExportButton'));

let JobOfferGroupsIndex = React.createClass({displayName: 'JobOfferGroupsIndex',
  mixins: [
    Reflux.connect(JobOfferGroupStore, 'jobOfferGroups')
  ],

  propTypes: {
    exportUrl: React.PropTypes.string.isRequired
  },

  render () {
    let jobOfferIds = this.state.jobOfferGroups ?
      this.state.jobOfferGroups.mapAttribute('job_offers').flatten().mapAttribute('id') :
      [];

    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          SearchFilter({title: 'Search', searchOn: 'participant_names', actions: actions.JobOfferGroupActions}),
          CheckBoxFilter({title: 'Participant Agreement', store: JobOfferSignedStore, actions: actions.JobOfferSignedActions}),
          CheckBoxFilter({title: 'Program', store: ProgramStore, actions: actions.ProgramActions}),
          CheckBoxFilter({title: 'Employer', store: EmployerStore, actions: actions.EmployerActions}),
          CheckBoxFilter({title: 'Coordinator', store: StaffStore, actions: actions.StaffActions}),
          ExportButton({url: this.props.exportUrl, ids: jobOfferIds})
        ),
        React.DOM.div({className: 'col-md-9'},
          JobOfferGroupsPanel()
        )
      )
    );
  }
});

module.exports = JobOfferGroupsIndex;
