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
          ? <a href={this.props.jobOffer.href}>View</a>
          : null;

    if (this.props.jobOffer.overtime.toLowerCase() === 'yes') {
      overtimeRate = (
        <ReadOnlyFormGroup label="Overtime rate per hour" value={"$" + parseFloat(this.props.jobOffer.overtime_rate).toFixed(2)} />
      );
    }

    if (this.props.jobOffer.participant_agreement != undefined) {
      jobOfferParticipantAgreement = (
        <ReadOnlyFormGroup label="Signed by" value={this.props.jobOffer.participant_agreement.full_name + " on " + Date.parse(this.props.jobOffer.participant_agreement.created_at).toString(dateFormat)} />
      );
    }

    if (this.props.jobOffer.file_maker_reference != undefined) {
      jobOfferFileMakerReference = (
        <ReadOnlyFormGroup label="Imported on" value={Date.parse(this.props.jobOffer.file_maker_reference.created_at).toString(dateFormat)} />
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
