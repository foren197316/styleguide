var JobOffer = React.createClass({
  propTypes: {
    jobOffer: React.PropTypes.object.isRequired
  },

  render: function () {
    var overtimeRate = null,
        position = PositionStore.findById(this.props.jobOffer.position_id),
        jobOfferParticipantAgreement = null,
        jobOfferFileMakerReference = null,
        jobOfferLink = this.props.jobOffer.href
          ? <a href={this.props.jobOffer.href}>{this.props.jobOfferLinkTitle}</a>
          : null;

    if (this.props.jobOffer.overtime === 'yes') {
      overtimeRate = (
        <ReadOnlyFormGroup label="Overtime rate per hour" value={"$" + parseFloat(this.props.jobOffer.overtime_rate).toFixed(2)} />
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
      <ParticipantGroupItemWrapper participant={this.props.jobOffer.participant}>
        <div className="form form-horizontal">
          <ReadOnlyFormGroup label="Position" value={position.name} />
          <ReadOnlyFormGroup label="Wage per hour" value={"$" + parseFloat(this.props.jobOffer.wage).toFixed(2)} />
          <ReadOnlyFormGroup label="Tipped?" value={this.props.jobOffer.tipped ? 'Yes' : 'No'} />
          <ReadOnlyFormGroup label="Hours per week" value={this.props.jobOffer.hours} />
          <ReadOnlyFormGroup label="Overtime?" value={this.props.jobOffer.overtime.capitaliseWord()} />
          {overtimeRate}
          {jobOfferParticipantAgreement}
          {jobOfferFileMakerReference}
          <ReadOnlyFormGroup label="" value={jobOfferLink} />
        </div>
      </ParticipantGroupItemWrapper>
    )
  }
});
