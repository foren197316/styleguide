/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
let JobListing = require('./JobListing');
let JobListingActions = require('../actions').JobListingActions;
let Pagination = require('./Pagination');
let ReloadingComponent = require('./ReloadingComponent');
let query = require('../query');
let { div } = React.DOM;
let initialData = query.getQuery() ? {} : (global.INITIAL_DATA || {});
let {
  job_listings:initialJobListings,
  meta:initialMeta,
  employers:initialEmployers
} = initialData;

let JobListingStore = require('../stores/JobListingStore');
let EmployerStore = require('../stores/EmployerStore');
let MetaStore = require('../stores/MetaStore');

let JobListingsIndex = React.createClass({
  displayName: 'JobListingsIndex',
  mixins: [
    React.addons.LinkedStateMixin,
    Reflux.connect(JobListingStore, 'jobListings'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(MetaStore, 'meta'),
    RenderLoadedMixin('jobListings', 'employers', 'meta')
  ],

  getInitialState: function () {
    return {
      formSending: false
    };
  },

  componentDidMount: function () {
    if (!initialJobListings || query.getQuery()) {
      JobListingActions.ajaxSearch(query.getQuery());
    } else {
      JobListingStore.set(initialJobListings);
      EmployerStore.set(initialEmployers);
      MetaStore.set(initialMeta);
    }
  },

  renderLoaded: function () {
    let meta = this.state.meta;
    let pageCount = meta.pageCount;
    let recordCount = meta.recordCount;
    let page = query.getCurrentPage();
    let formSendingLink = this.linkState('formSending');
    let recordName = 'Job Listings';

    return (
      div({className: 'row'},
        div({className: 'col-xs-12 col-md-3'}),
        div({className: 'col-xs-12 col-md-9'},
          React.createElement(ReloadingComponent, {loadingLink: formSendingLink},
            div({className: 'row'},
              div({className: 'col-xs-12'},
                React.createElement(Pagination, { pageCount, recordCount, page, recordName, actions: JobListingActions, formSending: formSendingLink })
              )
            ),
            div({className: 'row'},
              div({className: 'col-xs-12'},
                this.state.jobListings.map((jobListing, index) => {
                  let employer = this.state.employers.findById(jobListing.employer_id);
                  return React.createElement(JobListing, {jobListing, employer, meta, key: `jobListing-${index}`});
                })
              )
            ),
            div({className: 'row'},
              div({className: 'col-xs-12'},
                React.createElement(Pagination, { pageCount, recordCount, page, recordName, actions: JobListingActions, formSending: formSendingLink })
              )
            )
          )
        )
      )
    );
  }
});

module.exports = JobListingsIndex;
