'use strict';

var React = require('react/addons');
var ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
var ReadOnlyFormGroup = require('./ReadOnlyFormGroup');
var globals = require('../globals');
var dateFormatMDY = globals.dateFormatMDY;
var dateFormatYMD = globals.dateFormatYMD;
var moment = require('moment');

var OfferedParticipantGroupParticipant = React.createClass({displayName: 'OfferedParticipantGroupParticipant',
  propTypes: {
    offer: React.PropTypes.object.isRequired,
    participant: React.PropTypes.object.isRequired,
    position: React.PropTypes.object.isRequired,
    jobOfferParticipantAgreement: React.PropTypes.object,
    jobOfferFileMakerReference: React.PropTypes.object
  },

  getInitialState: function () {
    return {};
  },

  render: function () {
    var overtimeRate = null;
    var jobOfferParticipantAgreement = null;
    var jobOfferFileMakerReference = null;
    var jobOfferLink = this.props.offer.href ?
      React.DOM.a({href: this.props.offer.href}, this.props.offerLinkTitle) :
      null;

    if (this.props.offer.overtime === 'yes') {
      overtimeRate = (
        React.createElement(ReadOnlyFormGroup, {label: 'Overtime rate per hour', value: '$' + parseFloat(this.props.offer.overtime_rate).toFixed(2)})
      );
    }

    if (this.props.jobOfferParticipantAgreement != null) {
      jobOfferParticipantAgreement = (
        React.createElement(ReadOnlyFormGroup, {label: 'Signed by', value: this.props.jobOfferParticipantAgreement.full_name + ' on ' + moment(this.props.jobOfferParticipantAgreement.created_at, dateFormatYMD).format(dateFormatMDY)})
      );
    }

    if (this.props.jobOfferFileMakerReference != null) {
      jobOfferFileMakerReference = (
        React.createElement(ReadOnlyFormGroup, {label: 'Imported on', value: moment(this.props.jobOfferFileMakerReference.created_at, dateFormatYMD).format(dateFormatMDY)})
      );
    }

    return (
      React.createElement(ParticipantGroupParticipant, {participant: this.props.participant},
        React.DOM.div({className: 'form form-horizontal'},
          React.createElement(ReadOnlyFormGroup, {label: 'Position', value: this.props.position.name}),
          React.createElement(ReadOnlyFormGroup, {label: 'Wage per hour', value: '$' + parseFloat(this.props.offer.wage).toFixed(2)}),
          React.createElement(ReadOnlyFormGroup, {label: 'Tipped?', value: this.props.offer.tipped ? 'Yes' : 'No'}),
          React.createElement(ReadOnlyFormGroup, {label: 'Hours per week', value: this.props.offer.hours}),
          React.createElement(ReadOnlyFormGroup, {label: 'Overtime?', value: this.props.offer.overtime.capitaliseWord()}),
          overtimeRate,
          jobOfferParticipantAgreement,
          jobOfferFileMakerReference,
          React.createElement(ReadOnlyFormGroup, {label: '', value: jobOfferLink})
        )
      )
    );
  }
});

module.exports = OfferedParticipantGroupParticipant;
