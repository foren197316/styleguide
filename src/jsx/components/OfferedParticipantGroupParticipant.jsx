var OfferedParticipantGroupParticipant = React.createClass({
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
    var overtimeRate = null,
        jobOfferParticipantAgreement = null,
        jobOfferFileMakerReference = null,
        jobOfferLink = this.props.offer.href
          ? <a href={this.props.offer.href}>{this.props.offerLinkTitle}</a>
          : null;

    if (this.props.offer.overtime === 'yes') {
      overtimeRate = (
        <ReadOnlyFormGroup label="Overtime rate per hour" value={"$" + parseFloat(this.props.offer.overtime_rate).toFixed(2)} />
      );
    }

    if (this.props.jobOfferParticipantAgreement != null) {
      jobOfferParticipantAgreement = (
        <ReadOnlyFormGroup label="Signed by" value={this.props.jobOfferParticipantAgreement.full_name + " on " + Date.parse(this.props.jobOfferParticipantAgreement.created_at).toString(dateFormat)} />
      );
    }

    if (this.props.jobOfferFileMakerReference != null) {
      jobOfferFileMakerReference = (
        <ReadOnlyFormGroup label="Imported on" value={Date.parse(this.props.jobOfferFileMakerReference.created_at).toString(dateFormat)} />
      );
    }

    return (
      <ParticipantGroupItemWrapper participant={this.props.participant}>
        <div className="form form-horizontal">
          <ReadOnlyFormGroup label="Position" value={this.props.position.name} />
          <ReadOnlyFormGroup label="Wage per hour" value={"$" + parseFloat(this.props.offer.wage).toFixed(2)} />
          <ReadOnlyFormGroup label="Tipped?" value={this.props.offer.tipped ? 'Yes' : 'No'} />
          <ReadOnlyFormGroup label="Hours per week" value={this.props.offer.hours} />
          <ReadOnlyFormGroup label="Overtime?" value={this.props.offer.overtime.capitaliseWord()} />
          {overtimeRate}
          {jobOfferParticipantAgreement}
          {jobOfferFileMakerReference}
          <ReadOnlyFormGroup label="" value={jobOfferLink} />
        </div>
      </ParticipantGroupItemWrapper>
    )
  }
});
