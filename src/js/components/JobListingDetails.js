/* @flow */
'use strict';

var React = require('react/addons');
var RD = React.DOM;
var JobListing = require('./JobListing');
var currency = require('../currency');

module.exports = React.createClass({displayName: 'JobListingDetails',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired
  },

  render: function () {
    var jobListing = this.props.jobListing;

    return JobListing({jobListing: this.props.jobListing},
      RD.div({className: 'row'},
        RD.address({className: 'col-xs-6'},
          RD.span(null, jobListing.site_city, ', ', jobListing.site_state)
        ),
        (function () {
          if (jobListing.housing_type === 'Provided') {
            return RD.div({className: 'col-xs-6 text-right'},
              RD.dl({className: 'dl-horizontal'},
                RD.dt(null, 'Deposit'),
                RD.dd(null, currency(jobListing.housing_deposit)),
                RD.dt(null, 'Rent'),
                RD.dd(null, currency(jobListing.housing_rent))
              )
            );
          }
        })()
      ),
      RD.div({className: 'row'},
        RD.div({className: 'col-xs-12 col-md-6'},
          (function () {
            if (jobListing.employer_cultural_opportunites) {
              return (
                RD.div(null,
                  RD.strong(null, 'Cultural Opportunities'),
                  RD.p(null, jobListing.employer_cultural_opportunites)
                )
              );
            }
          })()
        ),
        RD.div({className: 'col-xs-12 col-md-6 text-right'},
          RD.strong(null, 'Housing'),
          RD.p(null, jobListing.housing_description)
        )
      ),
      RD.div({className: 'row'}, RD.hr(null)),
      RD.div({className: 'row'},
        RD.div({className: 'col-xs-6'},
          RD.a({href: '/job_listings/' + jobListing.id},
            RD.strong(null, 'Job Listing #', jobListing.id)
          )
        ),
        (function () {
          if (jobListing.employer_id) {
            return RD.div({className: 'col-xs-6 text-right'},
              RD.a({href: '/employers/' + jobListing.employer_id + '/job_listings'},
                RD.strong(null, jobListing.employer_name)
              )
            );
          }
        })()
      )
    );
  }
});
