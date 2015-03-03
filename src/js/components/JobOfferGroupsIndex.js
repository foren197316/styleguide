/* @flow */
'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var actions = require('../actions');
var SetUrlsMixin = require('../mixins').SetUrlsMixin;
var SearchFilter = require('./SearchFilter');
var CheckBoxFilter = require('./CheckBoxFilter');
var JobOfferGroupsPanel = require('./JobOfferGroupsPanel');
var JobOfferSignedStore = require('../stores/JobOfferSignedStore');
var ProgramStore = require('../stores/ProgramStore');
var EmployerStore = require('../stores/EmployerStore');
var StaffStore = require('../stores/StaffStore');
var JobOfferGroupStore = require('../stores/JobOfferGroupStore');
var ExportButton = require('./ExportButton');

var JobOfferGroupsIndex = React.createClass({displayName: 'JobOfferGroupsIndex',
  mixins: [
    SetUrlsMixin,
    Reflux.connect(JobOfferGroupStore, 'jobOfferGroups')
  ],

  render: function () {
    var jobOfferIds = this.state.jobOfferGroups ?
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
          ExportButton({url: this.props.urls.export, ids: jobOfferIds})
        ),
        React.DOM.div({className: 'col-md-9'},
          JobOfferGroupsPanel(null)
        )
      )
    );
  }
});

module.exports = JobOfferGroupsIndex;
