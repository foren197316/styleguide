/* @flow */
'use strict';

var React = require('react/addons');
var RD = React.DOM;
var JobListing = require('./JobListing');
var currency = require('../currency');

module.exports = React.createClass({displayName: 'JobListingDetails',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired,
    meta: React.PropTypes.object.isRequired
  },

  render: function () {
    var jobListing = this.props.jobListing;

    return React.createElement(JobListing, {jobListing: this.props.jobListing, meta: this.props.meta},
      RD.div({className: 'row'},
        RD.address({className: 'col-xs-9'},
          RD.span({}, jobListing.site_city, ', ', jobListing.site_state)
        ),
        (function () {
          if (jobListing.housing_type === 'Provided') {
            return RD.div({className: 'col-xs-3 text-right'},
              RD.dl({className: 'dl-horizontal'},
                RD.dt({}, 'Deposit'),
                RD.dd({}, currency(jobListing.housing_deposit)),
                RD.dt({}, 'Rent'),
                RD.dd({}, currency(jobListing.housing_rent))
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
                RD.div({},
                  RD.strong({}, 'Cultural Opportunities'),
                  RD.p({}, jobListing.employer_cultural_opportunites)
                )
              );
            }
          })()
        ),
        RD.div({className: 'col-xs-12 col-md-6 text-right'},
          RD.strong({}, 'Housing'),
          RD.p({}, jobListing.housing_description)
        )
      ),
      RD.div({className: 'row'}, RD.hr({})),
      RD.div({className: 'row'},
        RD.div({className: 'col-xs-6'},
          RD.a({href: '/job_listings/' + jobListing.id},
            RD.strong({}, 'Job Listing #', jobListing.id)
          )
        ),
        (function () {
          if (jobListing.employer_id) {
            return RD.div({className: 'col-xs-6 text-right'},
              RD.a({href: '/employers/' + jobListing.employer_id + '/job_listings'},
                RD.strong({}, jobListing.employer_name)
              )
            );
          }
        })()
      )
    );
  }
});
