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
      RD.div({className: 'row'}, RD.hr(null)),
      RD.div({className: 'row'},
        RD.div({className: 'col-xs-12 col-md-8'},
          RD.span(null,
            RD.strong(null, 'Deposit '),
            RD.small(null, currency(jobListing.housing_deposit))
          ),
          ' ',
          RD.span(null,
            RD.strong(null, 'Rent '),
            RD.small(null, currency(jobListing.housing_rent))
          )
        ),
        RD.div({className: 'col-xs-12 col-md-4'},
          RD.strong(null, jobListing.site_city, ', ', jobListing.site_state)
        )
      ),
      RD.div({className: 'row'},
        RD.div({className: 'col-xs-12 col-md-6'},
          jobListing.housing_description
        )
      ),
      RD.div({className: 'row'}, RD.hr(null)),
      RD.div({className: 'row'},
        RD.div({className: 'col-xs-12 col-md-6'},
          RD.strong(null, 'Cultural Opportunities')
        )
      ),
      RD.div({className: 'row'},
        RD.div({className: 'col-xs-12 col-md-6'},
          jobListing.employer_cultural_opportunites
        )
      ),
      RD.div({className: 'row'}, RD.hr(null)),
      RD.a({href: '/job_listings/' + jobListing.id},
        RD.div({className: 'row'},
          RD.div({className: 'col-xs-12 col-md-8'},
            RD.strong(null, 'Job Listing #', jobListing.id)
          ),
          RD.div({className: 'col-xs-12 col-md-4'},
            RD.strong(null, jobListing.employer_name)
          )
        )
      )
    );
  }
});
