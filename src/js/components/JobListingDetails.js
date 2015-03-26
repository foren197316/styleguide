/* @flow */
'use strict';

let React = require('react/addons');
let { div, address, span, strong, a, p, hr } = React.DOM;
let JobListing = require('./JobListing');
let currency = require('../currency');
let LinkToIf = require('./LinkToIf');

let JobListingDetails = React.createClass({
  displayName: 'JobListingDetails',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired,
    employer: React.PropTypes.object.isRequired,
    meta: React.PropTypes.object.isRequired
  },

  render () {
    let jobListing = this.props.jobListing;
    let employer = this.props.employer;
    let meta = this.props.meta;

    return React.createElement(JobListing, {jobListing, employer, meta},
      div({className: 'row'},
        div({className: 'col-xs-6'},
          (() => {
            if (employer.housing_type === 'Provided') {
              return (
                div({className: 'row'},
                  div({className: 'col-xs-12 col-md-6'},
                    div({className: ''},
                      span({className: 'clearfix'},
                       strong({}, 'Deposit'),
                       span({className: 'pull-right'}, currency(employer.housing_deposit))
                      ),
                      span({className: 'clearfix'},
                        strong({}, 'Rent'),
                        span({className: 'pull-right'}, currency(employer.housing_rent))
                      )
                    )
                  )
                )
              );
            }
          })(),
          p({}, employer.housing_description)
        ),
        address({className: 'col-xs-6 text-right'},
          span({}, employer.site_city, ', ', employer.site_state)
        )
      ),
      hr(),
      div({className: 'row'},
        div({className: 'col-xs-12 col-md-6'},
          (() => {
            if (employer.cultural_opportunities) {
              return (
                div({},
                  strong({}, 'Cultural Opportunities'),
                  p({}, employer.cultural_opportunities)
                )
              );
            }
          })()
        )
      ),
      div({className: 'row'}, hr()),
      div({className: 'row job-listing-meta'},
        div({className: 'col-xs-6'},
          a({href: '/job_listings/' + jobListing.id},
            strong({}, 'Job Listing #', jobListing.id)
          )
        ),
        div({className: 'col-xs-6 text-right'},
          LinkToIf({name: employer.name, href: employer.url}, span())
        )
      )
    );
  }
});

module.exports = JobListingDetails;
