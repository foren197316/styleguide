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
        <div className="list-group">
          <JobOffer jobOffer={jobOfferParticipantAgreement.job_offer} />;
        </div>
        <ParticipantGroupPanelFooter />
      </div>
    )
  }
});
