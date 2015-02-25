/* @flow */
'use strict';

var React = require('react/addons');
var currency = require('../currency');
var RD = React.DOM;

var JobListing = React.createClass({displayName: 'JobListing',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired
  },

  render: function () {
    var jobListing = this.props.jobListing;
    var href = '/job_listings/' + this.props.jobListing.id;

    return (
      RD.div({className: 'panel panel-default'},
        RD.div({className: 'panel-body'},
          RD.a({href: href},
            RD.div({className: 'row'},
              RD.div({className: 'col-xs-12 col-md-9'},
                RD.strong(null, jobListing.position_name, ' (', jobListing.openings, ')'),
                RD.div(null,
                  (function () {
                    if (jobListing.has_tips === 'true') {
                      return RD.span({className: 'label label-success'}, 'Tipped');
                    }
                  })(),
                  ' ',
                  (function () {
                    if (jobListing.has_overtime === 'true') {
                      return RD.span({className: 'label label-success'}, 'Overtime');
                    } else if (jobListing.has_overtime === 'maybe') {
                      return RD.span({className: 'label label-primary'}, 'Maybe Overtime');
                    }
                  })()
                )
              ),
              RD.div({className: 'col-xs-12 col-md-3 text-right'},
                RD.div(null,
                  RD.strong(null, currency(jobListing.wage)),
                  RD.small(null, '/hour')
                ),
                RD.div(null,
                  RD.strong(null, jobListing.hours, ' hours'),
                  RD.small(null, '/week')
                )
              )
            ),
            RD.hr(null),
            RD.div({className: 'row'},
              RD.div({className: 'col-xs-12 col-md-9'},
                RD.strong(null, jobListing.employer_type_name),
                ' ',
                RD.span(null, jobListing.employer_region_name)
              ),
              RD.div({className: 'col-xs-12 col-md-3 text-right'},
                (function () {
                  if (jobListing.housing_type === 'Provided') {
                    return RD.strong({className: 'text-success'}, 'Housing Provided');
                  } else {
                    return RD.strong({className: 'text-info'}, 'Housing Assistance');
                  }
                })()
              )
            )
          ),
          this.props.children
        )
      )
    );
  }
});

module.exports = JobListing;
