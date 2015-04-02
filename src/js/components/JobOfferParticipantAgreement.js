/* @flow */
'use strict';

let React = require('react/addons');
let EmployerStore = require('../stores/EmployerStore');
let StaffStore = require('../stores/StaffStore');
let EmployerHeader = React.createFactory(require('./EmployerHeader'));
let JobOffer = React.createFactory(require('./JobOffer'));
let ParticipantGroupPanelFooter = React.createFactory(require('./ParticipantGroupPanelFooter'));
let moment = require('moment');
let { div } = React.DOM;

let JobOfferParticipantAgreement = React.createClass({
  displayName: 'JobOfferParticipantAgreement',
  propTypes: {
    jobOffer: React.PropTypes.object.isRequired,
    jobOfferParticipantAgreement: React.PropTypes.object.isRequired,
    position: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {};
  },

  render () {
    let { jobOffer, position, jobOfferParticipantAgreement } = this.props;
    let employer = EmployerStore.findById(jobOfferParticipantAgreement.job_offer.employer_id);
    let staff = StaffStore.findById(employer.staff_id);

    return (
      div({className: 'panel panel-default participant-group-panel'},
        EmployerHeader({employer, staff}),
        div({className: 'list-group'},
          JobOffer({jobOffer, jobOfferParticipantAgreement, position})
        ),
        ParticipantGroupPanelFooter({name: ''},
          div({}, moment(jobOfferParticipantAgreement.created_at).fromNow())
        )
      )
    );
  }
});

module.exports = JobOfferParticipantAgreement;
