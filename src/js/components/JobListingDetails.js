/* @flow */
'use strict';

let React = require('react/addons');
let { div, address, span, strong, a, p, hr } = React.DOM;
let JobListing = require('./JobListing');
let currency = require('../currency');
let LinkToIf = require('./LinkToIf');

module.exports = React.createClass({displayName: 'JobListingDetails',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired,
    meta: React.PropTypes.object.isRequired
  },

  render () {
    let jobListing = this.props.jobListing;

    return React.createElement(JobListing, {jobListing: this.props.jobListing, meta: this.props.meta},
      div({className: 'row'},
        div({className: 'col-xs-6'},
          (() => {
            if (jobListing.housing_type === 'Provided') {
              return (
                div({className: 'row'},
                  div({className: 'col-xs-12 col-md-6'},
                    div({className: ''},
                      span({className: 'clearfix'},
                       strong({}, 'Deposit'),
                       span({className: 'pull-right'}, currency(jobListing.housing_deposit))
                      ),
                      span({className: 'clearfix'},
                        strong({}, 'Rent'),
                        span({className: 'pull-right'}, currency(jobListing.housing_rent))
                      )
                    )
                  )
                )
              );
            }
          })(),
          p({}, jobListing.housing_description)
        ),
        address({className: 'col-xs-6 text-right'},
          span({}, jobListing.site_city, ', ', jobListing.site_state)
        )
      ),
      hr(),
      div({className: 'row'},
        div({className: 'col-xs-12 col-md-6'},
          (() => {
            if (jobListing.employer_cultural_opportunites) {
              return (
                div({},
                  strong({}, 'Cultural Opportunities'),
                  p({}, jobListing.employer_cultural_opportunites)
                )
              );
            }
          })()
        )
      ),
      div({className: 'row'}, hr({})),
      div({className: 'row job-listing-meta'},
        div({className: 'col-xs-6'},
          a({href: '/job_listings/' + jobListing.id},
            strong({}, 'Job Listing #', jobListing.id)
          )
        ),
        div({className: 'col-xs-6 text-right'},
          LinkToIf({name: jobListing.employer_name, href: jobListing.employer_url}, span())
        )
      )
    );
  }
});
