/* @flow */
'use strict';
let React = require('react/addons');
let Reflux = require('reflux');
let { JobOfferGroupActions, loadFromJobOfferGroups, PositionActions } = require('../actions');
let JobOfferGroupStore = require('../stores/JobOfferGroupStore');
let ProgramStore = require('../stores/ProgramStore');
let PositionStore = require('../stores/PositionStore');
let EmployerStore = require('../stores/EmployerStore');
let StaffStore = require('../stores/StaffStore');
let RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
let ProgramHeader = require('./ProgramHeader');
let JobOfferGroup = React.createFactory(require('./JobOfferGroup'));
let { div } = React.DOM;

let JobOfferGroupsPanel = React.createClass({
  displayName: 'JobOfferGroupsPanel',
  mixins: [
    Reflux.connect(JobOfferGroupStore, 'jobOfferGroups'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    RenderLoadedMixin('jobOfferGroups', 'programs', 'positions', 'employers', 'staffs')
  ],

  componentDidMount () {
    JobOfferGroupActions.ajaxLoad(loadFromJobOfferGroups);
    PositionActions.ajaxLoad();
  },

  renderLoaded () {
    return (
      div({id: 'participant-group-panels'},
        this.state.programs.map((program, loopIndex) => {
          let programJobOfferGroups = this.state.jobOfferGroups.filter(jobOfferGroup => (
            jobOfferGroup.program_id === program.id
          ));

          if (programJobOfferGroups.length > 0) {
            return (
              div({key: 'job-offer-group-header-' + loopIndex},
                React.createElement(ProgramHeader, {program, collectionName: 'Job Offer', collection: programJobOfferGroups.mapAttribute('job_offers').flatten()}),
                programJobOfferGroups.map(jobOfferGroup => (
                  JobOfferGroup({jobOfferGroup, key: `program_job_offer_group${program.id}-${jobOfferGroup.id}`})
                ))
              )
            );
          }
        })
      )
    );
  }
});

module.exports = JobOfferGroupsPanel;
