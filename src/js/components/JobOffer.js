'use strict';

var ReadOnlyFormGroup = require('./ReadOnlyFormGroup');
var PositionStore = require('../stores/PositionStore');
var ParticipantGroupParticipant = require('./ParticipantGroupParticipant');

var JobOffer = React.createClass({displayName: 'JobOffer',
  propTypes: {
    jobOffer: React.PropTypes.object.isRequired,
    jobOfferParticipantAgreement: React.PropTypes.object
  },

  render: function () {
    var overtimeRate = null,
        position = PositionStore.findById(this.props.jobOffer.position_id),
        jobOfferParticipantAgreement = this.props.jobOfferParticipantAgreement || this.props.jobOffer.participant_agreement,
        jobOfferParticipantAgreementComponent = null,
        jobOfferFileMakerReference = null,
        jobOfferLink = this.props.jobOffer.href ?
          React.DOM.a({href: this.props.jobOffer.href}, 'View') :
          null;

    if (this.props.jobOffer.overtime.toLowerCase() === 'yes') {
      overtimeRate = (
        ReadOnlyFormGroup({label: 'Overtime rate per hour', value: '$' + parseFloat(this.props.jobOffer.overtime_rate).toFixed(2)})
      );
    }

    if (jobOfferParticipantAgreement != null) {
      jobOfferParticipantAgreementComponent = (
        ReadOnlyFormGroup({label: 'Signed by', value: jobOfferParticipantAgreement.full_name + ' on ' + Date.parse(jobOfferParticipantAgreement.created_at).toString(dateFormat)})
      );
    }

    if (this.props.jobOffer.file_maker_reference != null) {
      jobOfferFileMakerReference = (
        ReadOnlyFormGroup({label: 'Imported on', value: Date.parse(this.props.jobOffer.file_maker_reference.created_at).toString(dateFormat)})
      );
    }

    return (
      ParticipantGroupParticipant({participant: this.props.jobOffer.participant},
        React.DOM.div({className: 'form form-horizontal'},
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
