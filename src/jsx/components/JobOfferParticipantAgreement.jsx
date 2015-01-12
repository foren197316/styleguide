var JobOfferParticipantAgreement = React.createClass({
  propTypes: {
    jobOfferParticipantAgreement: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  render: function () {
    var employer = EmployerStore.findById(this.props.jobOfferParticipantAgreement.job_offer.employer_id);

    return (
      <div className="panel panel-default participant-group-panel">
        <EmployerHeader employer={employer} />
        <div className="list-group">
          <JobOffer jobOffer={this.props.jobOfferParticipantAgreement.job_offer} jobOfferParticipantAgreement={this.props.jobOfferParticipantAgreement} />
        </div>
      </div>
    )
  }
});
