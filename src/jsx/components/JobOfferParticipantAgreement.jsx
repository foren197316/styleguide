var JobOfferParticipantAgreement = React.createClass({
  propTypes: {
    jobOfferParticipantAgreement: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  render: function () {
    return (
      <div className="panel panel-default participant-group-panel">
        <EmployerHeader employer_id={this.props.jobOfferParticipantAgreement.job_offer.employer_id} />
        <div className="list-group">
          <JobOffer jobOffer={this.props.jobOfferParticipantAgreement.job_offer} jobOfferParticipantAgreement={this.props.jobOfferParticipantAgreement} />
        </div>
      </div>
    )
  }
});
