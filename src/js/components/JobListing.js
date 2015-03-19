/* @flow */
'use strict';
let React = require('react/addons');
let factory = React.createFactory;
let currency = require('../currency');
let api = require('../api');
let ConfirmOrCancelButton = factory(require('./ConfirmOrCancelButton'));
let JobListingStore = require('../stores/JobListingStore');
let { div, a, span, strong, small, hr } = React.DOM;
let { dateFormatMDY } = require('../globals');
let moment = require('moment');

let CONSTANTS = {
  SHOW: 'SHOW',
  APPLY: 'APPLY',
  SUCCESS: 'SUCCESS'
};

module.exports = React.createClass({
  displayName: 'JobListing',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired
  },

  getInitialState(){
    var status;

    if (JobListingStore.meta.in_matching_participant_group_id) {
      status = CONSTANTS.APPLY;
    } else if (JobListingStore.meta.on_review_participant_group_employer_id === this.props.jobListing.employer_id) {
      status = CONSTANTS.SUCCESS;
    } else {
      status = CONSTANTS.SHOW;
    }

    return { status };
  },

  putOnReview(){
    api.createOnReviewParticipantGroup(
      JobListingStore.meta.in_matching_participant_group_id,
      this.props.jobListing.employer_id
    )
    .then(() => {
      JobListingStore.setOnReviewParticipantGroupEmployerId(this.props.jobListing.employer_id);
    })
    .catch(err => {
      console.log(err);
    });
  },

  render () {
    var jobListing = this.props.jobListing;
    var href = '/job_listings/' + this.props.jobListing.id;

    return (
      div({className: 'panel panel-default'},
        div({className: 'panel-body'},
          a({href: href},
            div({className: 'row'},
              div({className: 'col-xs-7'},
                strong({className: 'hover-underline'}, `${jobListing.position_name} (${jobListing.openings})`),
                div({className: 'text-black'},
                  (function () {
                    if (jobListing.has_tips === 'true') {
                      return span({className: 'label label-success'}, 'Tipped');
                    }
                  })(),
                  ' ',
                  (function () {
                    if (jobListing.has_overtime === 'true') {
                      return span({className: 'label label-success'}, 'Overtime');
                    } else if (jobListing.has_overtime === 'maybe') {
                      return span({className: 'label label-primary'}, 'Maybe Overtime');
                    }
                  })()
                )
              ),
              div({className: 'col-xs-5 text-right text-black'},
                div({},
                  strong({}, currency(jobListing.wage)),
                  small({}, '/hour')
                ),
                div({},
                  strong({}, jobListing.hours, ' hours'),
                  small({}, '/week')
                )
              )
            ),
            hr(),
            div({className: 'row text-black'},
              div({className: 'col-xs-6'},
                strong({}, jobListing.employer_type_name), ' ',
                span({className: 'text-no-wrap'}, jobListing.employer_region_name)
              ),
              div({className: 'col-xs-6 text-right'},
                (function () {
                  if (jobListing.housing_type === 'Provided') {
                    return strong({className: 'text-success'}, 'Housing Provided');
                  } else {
                    return strong({className: 'text-info'}, 'Housing Assistance');
                  }
                })()
              )
            )
          ),
          this.props.children,
          (() => {
            if (this.state.status === CONSTANTS.APPLY) {
              return (
                div({className: 'row text-black'},
                  hr(),
                  div({className: 'col-xs-12 text-right'},
                    ConfirmOrCancelButton({confirmFunction: this.putOnReview}, 'Apply')
                  )
                )
              );
            } else if (this.state.status === CONSTANTS.SUCCESS) {
              return (
                div({className: 'row text-black'},
                  hr(),
                  div({className: 'col-xs-12 text-right'},
                    `Your application will be shared with ${this.props.jobListing.employer.name} until ${moment().add(3, 'days').format(dateFormatMDY)}`
                  )
                )
              );
            } else {
              return div();
            }
          })()
        )
      )
    );
  }
});
