/* @flow */
'use strict';
let React = require('react/addons');
let factory = React.createFactory;
let currency = require('../currency');
let api = require('../api');
let moment = require('moment');
let { div, a, span, strong, small, hr } = React.DOM;
let { dateFormatMDY } = require('../globals');

let MetaStore = require('../stores/MetaStore');

let ConfirmOrCancelButton = factory(require('./ConfirmOrCancelButton'));

const SHOW = 'show';
const APPLY = 'apply';
const SUCCESS = 'success';

module.exports = React.createClass({
  displayName: 'JobListing',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired,
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

    var status;
    if (this.props.meta.on_review_participant_group_employer_id === this.props.jobListing.employer_id) {
      status = SUCCESS;
    } else if (this.props.meta.in_matching_participant_group_id) {
      status = APPLY;
    } else {
      status = SHOW;
    }

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
            if (status === APPLY) {
              return (
                div({className: 'row text-black'},
                  hr(),
                  div({className: 'col-xs-12 text-right'},
                    ConfirmOrCancelButton({confirmFunction: this.putOnReview}, 'Apply')
                  )
                )
              );
            } else if (status === SUCCESS) {
              return (
                div({className: 'row text-black'},
                  hr(),
                  div({className: 'col-xs-12 text-right'},
                    span({}, 'Your application will be shared with '),
                    strong({}, this.props.jobListing.employer_name),
                    span({}, ' until '),
                    strong({}, moment().add(3, 'days').format(dateFormatMDY))
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
