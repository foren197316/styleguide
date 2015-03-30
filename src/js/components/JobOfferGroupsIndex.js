/* @flow */
'use strict';
let React = require('react/addons');
let Reflux = require('reflux');
let { JobOfferGroupActions, loadFromJobOfferGroups, PositionActions } = require('../actions');

let AjaxSearchForm = React.createFactory(require('./AjaxSearchForm'));
let AjaxSearchFilter = React.createFactory(require('./AjaxSearchFilter'));
let AjaxCheckBoxFilter = React.createFactory(require('./AjaxCheckBoxFilter'));
let ExportButton = React.createFactory(require('./ExportButton'));
let JobOfferGroup = React.createFactory(require('./JobOfferGroup'));
let Pagination = React.createFactory(require('./Pagination'));
let ReloadingComponent = React.createFactory(require('./ReloadingComponent'));

let JobOfferSignedStore = require('../stores/JobOfferSignedStore');
let JobOfferGroupStore = require('../stores/JobOfferGroupStore');
let ProgramStore = require('../stores/ProgramStore');
let PositionStore = require('../stores/PositionStore');
let EmployerStore = require('../stores/EmployerStore');
let MetaStore = require('../stores/MetaStore');
let StaffStore = require('../stores/StaffStore');
let { RenderLoadedMixin } = require('../mixins');
let { getQuery, getCurrentPage } = require('../query');
let { div, a } = React.DOM;

let JobOfferGroupsIndex = React.createClass({
  displayName: 'JobOfferGroupsIndex',
  mixins: [
    React.addons.LinkedStateMixin,
    Reflux.connect(PositionStore, 'positions'),
    RenderLoadedMixin('jobOfferGroups', 'programs', 'positions', 'employers', 'staffs', 'meta')
  ],

  propTypes: {
    exportUrl: React.PropTypes.string.isRequired
  },

  getInitialState () {
    return {
      formSending: false
    };
  },

  componentDidMount () {
    this.listenTo(JobOfferGroupStore, () => console.log('JobOfferGroupStore triggered'));
    this.listenTo(ProgramStore, () => console.log('ProgramStore triggered'));
    this.listenTo(EmployerStore, () => console.log('EmployerStore triggered'));
    this.listenTo(StaffStore, () => console.log('StaffStore triggered'));
    this.listenTo(MetaStore, () => console.log('MetaStore triggered'));

    this.joinTrailing(
      JobOfferGroupStore,
      ProgramStore,
      EmployerStore,
      StaffStore,
      MetaStore,
      this.setData
    );

    JobOfferGroupActions.ajaxSearch(getQuery(), loadFromJobOfferGroups);
    PositionActions.ajaxLoad();
  },

  setData (jobOfferGroupData, programData, employerData, staffData, metaData) {
    let jobOfferGroups = jobOfferGroupData[0];
    let programs = programData[0];
    let employers = employerData[0];
    let staffs = staffData[0];
    let meta = metaData[0];
    let state = { jobOfferGroups, programs, employers, staffs, meta };
    console.log(state);
    this.setState(state);
  },

  renderLoaded () {
    let { jobOfferGroups, programs, positions, employers, staffs, meta } = this.state;
    let formSending = this.linkState('formSending');
    let recordName = 'Job Offers';
    let anchor = 'searchTop';
    let page = getCurrentPage();
    let pageCount = meta.pageCount;
    let recordCount = meta.recordCount;
    let callbacks = [loadFromJobOfferGroups];
    let jobOfferIds = jobOfferGroups ?
      jobOfferGroups.mapAttribute('job_offers').flatten().mapAttribute('id') :
      [];

    return (
      div({className: 'row'},
        div({className: 'col-md-3'},
          AjaxSearchForm({ actions: JobOfferGroupActions, formSending, callbacks },
            AjaxSearchFilter({title: 'Search', searchOn: 'name'}),
            AjaxCheckBoxFilter({title: 'Participant Agreement', fieldName: 'participant_agreement', store: JobOfferSignedStore}),
            AjaxCheckBoxFilter({title: 'Program', fieldName: 'program_id', store: ProgramStore}),
            AjaxCheckBoxFilter({title: 'Employer', fieldName: 'participant_agreement_employer_id', store: EmployerStore}),
            AjaxCheckBoxFilter({title: 'Coordinator', fieldName: 'staff_id', store: StaffStore})
          ),
          ExportButton({url: this.props.exportUrl, ids: jobOfferIds})
        ),
        div({className: 'col-md-9'},
          div({id: 'participant-group-panels'},
            a({ name: anchor }),
            ReloadingComponent({ loadingLink: formSending },
              div({className: 'row'},
                div({className: 'col-md-12'},
                  Pagination({ pageCount, recordCount, page, actions: JobOfferGroupActions, formSending, recordName, callbacks })
                )
              ),
              jobOfferGroups.map(jobOfferGroup => {
                let employer = employers.findById(jobOfferGroup.employer_id);
                let staff = staffs.findById(employer.staff_id);
                let program = programs.findById(jobOfferGroup.program_id);
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
        )
      )
    );
  }
});

module.exports = JobOfferGroupsIndex;
