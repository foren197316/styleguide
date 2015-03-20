/* @flow */
'use strict';

let React = require('react/addons');
let { div, address, span, dl, dd, dt, strong, a, p, hr } = React.DOM;
let JobListing = require('./JobListing');
let currency = require('../currency');

module.exports = React.createClass({displayName: 'JobListingDetails',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired,
    meta: React.PropTypes.object.isRequired
  },

  render () {
    let jobListing = this.props.jobListing;

    return React.createElement(JobListing, {jobListing: this.props.jobListing, meta: this.props.meta},
      div({className: 'row'},
        address({className: 'col-xs-9'},
          span({}, jobListing.site_city, ', ', jobListing.site_state)
        ),
        (() => {
          if (jobListing.housing_type === 'Provided') {
            return (
              div({className: 'col-xs-3 text-right'},
                dl({className: 'dl-horizontal'},
                  dt({}, 'Deposit'),
                  dd({}, currency(jobListing.housing_deposit)),
                  dt({}, 'Rent'),
                  dd({}, currency(jobListing.housing_rent))
                )
              )
            );
          }
        })()
      ),
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
        ),
        div({className: 'col-xs-12 col-md-6 text-right'},
          strong({}, 'Housing'),
          p({}, jobListing.housing_description)
        )
      ),
      div({className: 'row'}, hr({})),
      div({className: 'row'},
        div({className: 'col-xs-6'},
          a({href: '/job_listings/' + jobListing.id},
            strong({}, 'Job Listing #', jobListing.id)
          )
        ),
        (() => {
          if (jobListing.employer_id) {
            return (
              div({className: 'col-xs-6 text-right'},
                a({href: '/employers/' + jobListing.employer_id + '/job_listings'},
                  strong({}, jobListing.employer_name)
                )
              )
            );
          }
        })()
      )
    );
  }
});
