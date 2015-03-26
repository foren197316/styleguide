/* @flow */
'use strict';

let React = require('react/addons');
let factory = React.createFactory;
let currency = require('../currency');
let api = require('../api');
let moment = require('moment');
let { div, a, span, strong, small, hr } = React.DOM;
let { dateFormatMDY } = require('../globals');
let ConfirmOrCancelButton = factory(require('./ConfirmOrCancelButton'));

let MetaStore = require('../stores/MetaStore');

const SHOW = 'show';
const APPLY = 'apply';
const UNAVAILABLE = 'unavailable';
const SUCCESS = 'success';

module.exports = React.createClass({
  displayName: 'JobListing',

  propTypes: {
    jobListing: React.PropTypes.object.isRequired,
    employer: React.PropTypes.object.isRequired,
    meta: React.PropTypes.object.isRequired
  },

  putOnReview(){
    api.createOnReviewParticipantGroup(
      this.props.meta.in_matching_participant_group_id,
      this.props.jobListing.employer_id
    )
    .then(() => {
      MetaStore.setAttribute('on_review_participant_group_employer_id', this.props.jobListing.employer_id);
    })
    .catch(err => {
      console.log(err);
    });
  },

  render () {
    let jobListing = this.props.jobListing;
    let href = `/job_listings/${this.props.jobListing.id}`;
    let employer = this.props.employer;
    let enrollment = employer.enrollments.findById(jobListing.program_id, 'program_id');
    let onReviewParticipantGroupEmployerId = this.props.meta.on_review_participant_group_employer_id;

    var status;
    if (onReviewParticipantGroupEmployerId === jobListing.employer_id) {
      status = SUCCESS;
    } else if (!enrollment || enrollment.on_review_count >= enrollment.on_review_maximum) {
      status = UNAVAILABLE;
    } else if (this.props.meta.in_matching_participant_group_id && !onReviewParticipantGroupEmployerId) {
      status = APPLY;
    } else {
      status = SHOW;
    }

    return (
      div({className: 'panel panel-default'},
        div({className: 'panel-body'},
          a({href: href},
            div({className: 'row'},
              div({className: 'col-xs-12'},
                strong({className: 'text-black'}, employer.name),
                span({className: 'text-black pull-right'}, employer.type_name)
              )
            ),
            hr(),
            div({className: 'row'},
              div({className: 'col-xs-7'},
                strong({className: 'hover-underline'}, `${jobListing.position_name} (${jobListing.openings})`),
                div({className: 'text-black'},
                  (() => {
                    if (jobListing.has_tips === 'true') {
                      return span({className: 'label label-success'}, 'Tipped');
                    }
                  })(),
                  ' ',
                  (() => {
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
                (() => {
                  if (employer.housing_type === 'Provided') {
                    return strong({className: 'text-success'}, 'Housing Provided');
                  } else {
                    return strong({className: 'text-info'}, 'Housing Assistance');
                  }
                })()
              ),
              div({className: 'col-xs-6 text-right'},
                strong({className: 'text-no-wrap'}, employer.region_name)
              )
            )
          ),
          this.props.children,
          (() => {
            if (status === SUCCESS) {
              return (
                div({className: 'row text-black'},
                  hr(),
                  div({className: 'col-xs-12 text-right'},
                    span({}, 'Your application will be shared with '),
                    strong({}, employer.name),
                    span({}, ' until '),
                    strong({}, moment().add(3, 'days').format(dateFormatMDY))
                  )
                )
              );
            } else if (status === UNAVAILABLE) {
              return (
                div({className: 'row text-black'},
                  hr(),
                  div({className: 'col-xs-12 text-right'},
                    span({}, 'This employer is not accepting new applications now, check back soon.')
                  )
                )
              );
            } else if (status === APPLY) {
              return (
                div({className: 'row text-black'},
                  hr(),
                  div({className: 'col-xs-12 text-right'},
                    ConfirmOrCancelButton({confirmFunction: this.putOnReview}, 'Apply')
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
