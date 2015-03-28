/* @flow */
'use strict';
let React = require('react/addons');
let Reflux = require('reflux');
let {
  JobOfferGroupActions,
  loadFromJobOfferGroups,
  PositionActions
} = require('../actions');
let JobOfferGroupStore = require('../stores/JobOfferGroupStore');
let ProgramStore = require('../stores/ProgramStore');
let PositionStore = require('../stores/PositionStore');
let EmployerStore = require('../stores/EmployerStore');
let MetaStore = require('../stores/MetaStore');
let StaffStore = require('../stores/StaffStore');
let RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
let Pagination = React.createFactory(require('./Pagination'));
let ReloadingComponent = React.createFactory(require('./ReloadingComponent'));
let JobOfferGroup = React.createFactory(require('./JobOfferGroup'));
let { getQuery, getCurrentPage } = require('../query');
let { div, a } = React.DOM;

let JobOfferGroupsPanel = React.createClass({
  displayName: 'JobOfferGroupsPanel',
  mixins: [
    React.addons.LinkedStateMixin,
    Reflux.connect(PositionStore, 'positions'),
    RenderLoadedMixin('jobOfferGroups', 'programs', 'positions', 'employers', 'staffs', 'meta')
  ],

  componentDidMount () {
    if (!this.joiner) {
      this.joiner = this.joinTrailing(
        JobOfferGroupStore,
        ProgramStore,
        EmployerStore,
        StaffStore,
        MetaStore,
        this.setData
      );
    }

    JobOfferGroupActions.ajaxSearch(getQuery(), loadFromJobOfferGroups);
    PositionActions.ajaxLoad();
  },

  setData (jobOfferGroupData, programData, employerData, staffData, metaData) {
    let jobOfferGroups = jobOfferGroupData[0];
    let programs = programData[0];
    let employers = employerData[0];
    let staffs = staffData[0];
    let meta = metaData[0];
    this.setState({ jobOfferGroups, programs, employers, staffs, meta });
  },

  renderLoaded () {
    let page = getCurrentPage();
    let pageCount = this.state.meta.pageCount;
    let recordCount = this.state.meta.recordCount;
    let formSending = this.linkState('formSending');
    let recordName = 'Job Offers';
    let anchor = 'searchTop';
    let positions = this.state.positions;
    let callbacks = [loadFromJobOfferGroups];

    return (
      div({id: 'participant-group-panels'},
        a({ name: anchor }),
        ReloadingComponent({ loadingLink: formSending },
          div({className: 'row'},
            div({className: 'col-md-12'},
              Pagination({ pageCount, recordCount, page, actions: JobOfferGroupActions, formSending, recordName, callbacks })
            )
          ),
          this.state.jobOfferGroups.map(jobOfferGroup => {
            let employer = this.state.employers.findById(jobOfferGroup.employer_id);
            let staff = this.state.staffs.findById(employer.staff_id);
            let program = this.state.programs.findById(jobOfferGroup.program_id);
            let key = jobOfferGroup.id;
            return JobOfferGroup({ jobOfferGroup, employer, positions, staff, program, key });
          }),
          div({className: 'row'},
            div({className: 'col-md-12'},
              Pagination({ pageCount, recordCount, page, anchor, actions: JobOfferGroupActions, formSending, recordName, callbacks })
            )
          )
        )
      )
    );
  }
});

module.exports = JobOfferGroupsPanel;
