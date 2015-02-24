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
        RD.div({className: 'col-xs-12 col-md-9'},
          RD.strong(null, jobListing.site_city, ', ', jobListing.site_state)
        ),
        RD.div({className: 'col-xs-12 col-md-3 text-right'},
          RD.dl({className: 'dl-horizontal'},
            RD.dt(null, 'Deposit'),
            RD.dd(null, currency(jobListing.housing_deposit)),
            RD.dt(null, 'Rent'),
            RD.dd(null, currency(jobListing.housing_rent))
          )
        )
      ),
      RD.div({className: 'row'},
        RD.div({className: 'col-xs-12 col-md-6'},
          RD.strong(null, 'Cultural Opportunities'),
          RD.p(null, jobListing.employer_cultural_opportunites)
        ),
        RD.div({className: 'col-xs-12 col-md-6 text-right'},
          RD.strong(null, 'Description'),
          RD.p(null, jobListing.housing_description)
        )
      ),
      RD.div({className: 'row'}, RD.hr(null)),
      RD.a({href: '/job_listings/' + jobListing.id},
        RD.div({className: 'row'},
          RD.div({className: 'col-xs-12 col-md-2'},
            RD.strong(null, 'Job Listing #', jobListing.id)
          ),
          RD.div({className: 'col-xs-12 col-md-10 text-right'},
            RD.strong(null, jobListing.employer_name)
          )
        )
      )
    );
  }
});
