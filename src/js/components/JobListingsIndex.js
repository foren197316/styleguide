/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let { RenderLoadedMixin } = require('../mixins');
let JobListing = React.createFactory(require('./JobListing'));
let { JobListingActions, loadFromJobListings } = require('../actions');
let Pagination = React.createFactory(require('./Pagination'));
let ReloadingComponent = React.createFactory(require('./ReloadingComponent'));
let query = require('../query');
let { div } = React.DOM;

let JobListingStore = require('../stores/JobListingStore');
let EmployerStore = require('../stores/EmployerStore');
let MetaStore = require('../stores/MetaStore');
let LoadingStore = require('../stores/LoadingStore');

let JobListingsIndex = React.createClass({
  displayName: 'JobListingsIndex',
  mixins: [
    Reflux.ListenerMixin,
    Reflux.connect(MetaStore, 'meta'),
    Reflux.connect(LoadingStore, 'isLoading'),
    RenderLoadedMixin('jobListings', 'employers', 'meta')
  ],

  getInitialState () {
    return {
      isLoading: false
    };
  },

  componentDidMount () {
    this.joinTrailing(JobListingStore, EmployerStore, this.setStoreData);

    if (!this.state.jobListings) {
      if (query.getQuery()) {
        JobListingActions.ajaxSearch(query.getQuery(), loadFromJobListings);
      } else {
        let {
          job_listings:initialJobListings,
          meta:initialMeta,
          employers:initialEmployers
        } = (global.INITIAL_DATA || {});

        JobListingStore.set(initialJobListings);
        EmployerStore.set(initialEmployers);
        MetaStore.set(initialMeta);
      }
    }
  },

  setStoreData (jobListingsData, employersData) {
    if (this.isMounted()) {
      let jobListings = jobListingsData[0];
      let employers = employersData[0];
      this.setState({ jobListings, employers });
    }
  },

  renderLoaded () {
    let { isLoading, meta } = this.state;
    let { pageCount, recordCount } = meta;
    let page = query.getCurrentPage();
    let recordName = 'Job Listing';
    let callbacks = [loadFromJobListings];

    return (
      div({className: 'row'},
        div({className: 'col-xs-12 col-md-3'}),
        div({className: 'col-xs-12 col-md-9'},
          ReloadingComponent({ isLoading },
            div({className: 'row'},
              div({className: 'col-xs-12'},
                Pagination({ pageCount, recordCount, page, recordName, actions: JobListingActions, callbacks })
              )
            ),
            div({className: 'row'},
              div({className: 'col-xs-12'},
                this.state.jobListings.map((jobListing, index) => {
                  let employer = this.state.employers.findById(jobListing.employer_id);
                  return JobListing({jobListing, employer, meta, key: `jobListing-${index}`});
                })
              )
            ),
            div({className: 'row'},
              div({className: 'col-xs-12'},
                Pagination({ pageCount, recordCount, page, recordName, actions: JobListingActions, callbacks })
              )
            )
          )
        )
      )
    );
  }
});

module.exports = JobListingsIndex;
