/* @flow */
'use strict';

var React = require('react/addons');
var globals = require('../globals');
var dateFormatMDY = globals.dateFormatMDY;
var dateFormatYMD = globals.dateFormatYMD;
var ReadOnlyFormGroup = require('./ReadOnlyFormGroup');
var PositionStore = require('../stores/PositionStore');
var ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
var moment = require('moment');

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
        React.createElement(ReadOnlyFormGroup, {label: 'Overtime rate per hour', value: '$' + parseFloat(this.props.jobOffer.overtime_rate).toFixed(2)})
      );
    }

    if (jobOfferParticipantAgreement != null) {
      jobOfferParticipantAgreementComponent = (
        React.createElement(ReadOnlyFormGroup, {label: 'Signed by', value: jobOfferParticipantAgreement.full_name + ' on ' + moment(jobOfferParticipantAgreement.created_at, dateFormatYMD).format(dateFormatMDY)})
      );
    }

    if (this.props.jobOffer.file_maker_reference != null) {
      jobOfferFileMakerReference = (
        React.createElement(ReadOnlyFormGroup, {label: 'Imported on', value: moment(this.props.jobOffer.file_maker_reference.created_at, dateFormatYMD).format(dateFormatMDY)})
      );
    }

    return (
      React.createElement(ParticipantGroupParticipant, {participant: this.props.jobOffer.participant},
        React.DOM.div({className: 'form form-horizontal'},
          React.createElement(ReadOnlyFormGroup, {label: 'Position', value: position.name}),
          React.createElement(ReadOnlyFormGroup, {label: 'Wage per hour', value: '$' + parseFloat(this.props.jobOffer.wage).toFixed(2)}),
          React.createElement(ReadOnlyFormGroup, {label: 'Tipped?', value: this.props.jobOffer.tipped ? 'Yes' : 'No'}),
          React.createElement(ReadOnlyFormGroup, {label: 'Hours per week', value: this.props.jobOffer.hours}),
          React.createElement(ReadOnlyFormGroup, {label: 'Overtime?', value: this.props.jobOffer.overtime.capitaliseWord()}),
          overtimeRate,
          jobOfferParticipantAgreementComponent,
          jobOfferFileMakerReference,
          React.createElement(ReadOnlyFormGroup, {label: '', value: jobOfferLink})
        )
      )
    );
  }
});

module.exports = JobOffer;