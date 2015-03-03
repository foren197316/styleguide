/* @flow */
'use strict';

var React = require('react/addons');
var currency = require('../currency');
var RD = React.DOM;

module.exports = React.createClass({displayName: 'JobListing',
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
              RD.div({className: 'col-xs-7'},
                RD.strong({className: 'hover-underline'}, jobListing.position_name, ' (', jobListing.openings, ')'),
                RD.div({className: 'text-black'},
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
              RD.div({className: 'col-xs-5 text-right text-black'},
                RD.div({},
                  RD.strong({}, currency(jobListing.wage)),
                  RD.small({}, '/hour')
                ),
                RD.div({},
                  RD.strong({}, jobListing.hours, ' hours'),
                  RD.small({}, '/week')
                )
              )
            ),
            RD.hr(),
            RD.div({className: 'row text-black'},
              RD.div({className: 'col-xs-6'},
                RD.strong({}, jobListing.employer_type_name),
                ' ',
                RD.span({className: 'text-no-wrap'}, jobListing.employer_region_name)
              ),
              RD.div({className: 'col-xs-6 text-right'},
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
