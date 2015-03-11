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
          React.createElement(SearchFilter, {title: 'Search', searchOn: 'participant_names', actions: actions.JobOfferGroupActions}),
          React.createElement(CheckBoxFilter, {title: 'Participant Agreement', store: JobOfferSignedStore, actions: actions.JobOfferSignedActions}),
          React.createElement(CheckBoxFilter, {title: 'Program', store: ProgramStore, actions: actions.ProgramActions}),
          React.createElement(CheckBoxFilter, {title: 'Employer', store: EmployerStore, actions: actions.EmployerActions}),
          React.createElement(CheckBoxFilter, {title: 'Coordinator', store: StaffStore, actions: actions.StaffActions}),
          React.createElement(ExportButton, {url: this.props.urls.export, ids: jobOfferIds})
        ),
        React.DOM.div({className: 'col-md-9'},
          React.createElement(JobOfferGroupsPanel, {})
        )
      )
    );
  }
});

module.exports = JobOfferGroupsIndex;
