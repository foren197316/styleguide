/* @flow */
'use strict';
let React = require('react/addons');
let { dateFormatMDY, dateFormatYMD } = require('../globals');
let ReadOnlyFormGroup = React.createFactory(require('./ReadOnlyFormGroup'));
let ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
let moment = require('moment');
let { div, a } = React.DOM;

let JobOffer = React.createClass({
  displayName: 'JobOffer',
  propTypes: {
    jobOffer: React.PropTypes.object.isRequired,
    jobOfferParticipantAgreement: React.PropTypes.object,
    position: React.PropTypes.object.isRequired
  },

  render () {
    let overtimeRate = null;
    let position = this.props.position;
    let jobOfferParticipantAgreement = this.props.jobOfferParticipantAgreement || this.props.jobOffer.participant_agreement;
    let jobOfferParticipantAgreementComponent = null;
    let jobOfferFileMakerReference = null;
    let jobOfferLink = this.props.jobOffer.href ?
          a({href: this.props.jobOffer.href}, 'View') :
          null;

    if (this.props.jobOffer.overtime.toLowerCase() === 'yes') {
      overtimeRate = (
        ReadOnlyFormGroup({label: 'Overtime rate per hour', value: '$' + parseFloat(this.props.jobOffer.overtime_rate).toFixed(2)})
      );
    }

    if (jobOfferParticipantAgreement != null) {
      jobOfferParticipantAgreementComponent = (
        ReadOnlyFormGroup({label: 'Signed by', value: `${jobOfferParticipantAgreement.full_name} on  ${moment(jobOfferParticipantAgreement.created_at, dateFormatYMD).format(dateFormatMDY)}`})
      );
    }

    if (this.props.jobOffer.file_maker_reference != null) {
      jobOfferFileMakerReference = (
        ReadOnlyFormGroup({label: 'Imported on', value: moment(this.props.jobOffer.file_maker_reference.created_at, dateFormatYMD).format(dateFormatMDY)})
      );
    }

    return (
      React.createElement(ParticipantGroupParticipant, {participant: this.props.jobOffer.participant},
        div({className: 'form form-horizontal'},
          ReadOnlyFormGroup({label: 'Position', value: position.name}),
          ReadOnlyFormGroup({label: 'Wage per hour', value: '$' + parseFloat(this.props.jobOffer.wage).toFixed(2)}),
          ReadOnlyFormGroup({label: 'Tipped?', value: this.props.jobOffer.tipped ? 'Yes' : 'No'}),
          ReadOnlyFormGroup({label: 'Hours per week', value: this.props.jobOffer.hours}),
          ReadOnlyFormGroup({label: 'Overtime?', value: this.props.jobOffer.overtime.capitaliseWord()}),
          overtimeRate,
          jobOfferParticipantAgreementComponent,
          jobOfferFileMakerReference,
          ReadOnlyFormGroup({label: '', value: jobOfferLink})
        )
      )
    );
  }
});

module.exports = JobOffer;
