/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
let JobListing = require('./JobListing');
let { JobListingActions, loadFromJobListings } = require('../actions');
let Pagination = React.createFactory(require('./Pagination'));
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
    Reflux.ListenerMixin,
    React.addons.LinkedStateMixin,
    RenderLoadedMixin('jobListings', 'employers', 'meta')
  ],

  getInitialState () {
    return {
      formSending: false
    };
  },

  componentDidMount () {
    this.joinTrailing(JobListingStore, EmployerStore, MetaStore, this.setStoreData);

    if (!this.state.jobListings) {
      if (query.getQuery()) {
        JobListingActions.ajaxSearch(query.getQuery(), loadFromJobListings);
      } else {
        JobListingStore.set(initialJobListings);
        EmployerStore.set(initialEmployers);
        MetaStore.set(initialMeta);
      }
    }
  },

  setStoreData (jobListingsData, employersData, metaData) {
    if (this.isMounted()) {
      let jobListings = jobListingsData[0];
      let employers = employersData[0];
      let meta = metaData[0];
      this.setState({ jobListings, employers, meta });
    }
  },

  renderLoaded () {
    let meta = this.state.meta;
    let pageCount = meta.pageCount;
    let recordCount = meta.recordCount;
    let page = query.getCurrentPage();
    let formSending = this.linkState('formSending');
    let recordName = 'Job Listings';
    let callbacks = [loadFromJobListings];

    return (
      div({className: 'row'},
        div({className: 'col-xs-12 col-md-3'}),
        div({className: 'col-xs-12 col-md-9'},
          React.createElement(ReloadingComponent, {loadingLink: formSending},
            div({className: 'row'},
              div({className: 'col-xs-12'},
                Pagination({ pageCount, recordCount, page, recordName, actions: JobListingActions, formSending, callbacks })
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
                Pagination({ pageCount, recordCount, page, recordName, actions: JobListingActions, formSending, callbacks })
              )
            )
          )
        )
      )
    );
  }
});

module.exports = JobListingsIndex;
