/* @flow */
'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var actions = require('../actions');
var JobOfferGroupStore = require('../stores/JobOfferGroupStore');
var ProgramStore = require('../stores/ProgramStore');
var PositionStore = require('../stores/PositionStore');
var EmployerStore = require('../stores/EmployerStore');
var StaffStore = require('../stores/StaffStore');
var RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
var ProgramHeader = require('./ProgramHeader');
var JobOfferGroup = require('./JobOfferGroup');

var JobOfferGroupsPanel = React.createClass({displayName: 'JobOfferGroupsPanel',
  mixins: [
    Reflux.connect(JobOfferGroupStore, 'jobOfferGroups'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    RenderLoadedMixin('jobOfferGroups', 'programs', 'positions', 'employers', 'staffs')
  ],

  componentDidMount: function () {
    actions.JobOfferGroupActions.ajaxLoad(actions.loadFromJobOfferGroups);
    actions.PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      React.DOM.div({id: 'participant-group-panels'},
        this.state.programs.map(function (program) {
          var programJobOfferGroups = this.state.jobOfferGroups.filter(function (jobOfferGroup) {
            return jobOfferGroup.program_id === program.id;
          });

          if (programJobOfferGroups.length > 0) {
            return (
              React.DOM.div({},
                React.createElement(ProgramHeader, {program: program, collectionName: 'Job Offer', collection: programJobOfferGroups.mapAttribute('job_offers').flatten()}),
                programJobOfferGroups.map(function (jobOfferGroup) {
                  return React.createElement(JobOfferGroup, {jobOfferGroup: jobOfferGroup, key: 'program_job_offer_group'+program.id+'-'+jobOfferGroup.id});
                })
              )
            );
          }
        }, this)
      )
    );
  }
});

module.exports = JobOfferGroupsPanel;
