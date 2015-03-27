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
    Reflux.connect(JobOfferGroupStore, 'jobOfferGroups'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    Reflux.connect(MetaStore, 'meta'),
    RenderLoadedMixin('jobOfferGroups', 'programs', 'positions', 'employers', 'staffs', 'meta')
  ],

  componentDidMount () {
    JobOfferGroupActions.ajaxSearch(getQuery(), loadFromJobOfferGroups);
    PositionActions.ajaxLoad();
  },

  renderLoaded () {
    let page = getCurrentPage();
    let pageCount = this.state.meta.pageCount;
    let recordCount = this.state.meta.recordCount;
    let formSending = this.linkState('formSending');
    let recordName = 'Job Offers';
    let anchor = 'searchTop';

    return (
      div({id: 'participant-group-panels'},
        a({ name: anchor }),
        ReloadingComponent({ loadingLink: formSending },
          div({className: 'row'},
            div({className: 'col-md-12'},
              Pagination({ pageCount, recordCount, page, actions: JobOfferGroupActions, formSending, recordName })
            )
          ),
          this.state.jobOfferGroups.map(jobOfferGroup => (
            JobOfferGroup({jobOfferGroup, key: jobOfferGroup.id})
          )),
          div({className: 'row'},
            div({className: 'col-md-12'},
              Pagination({ pageCount, recordCount, page, anchor, actions: JobOfferGroupActions, formSending, recordName })
            )
          )
        )
      )
    );
  }
});

module.exports = JobOfferGroupsPanel;
