var JobOfferParticipantAgreementsPanel = React.createClass({
  mixins: [
    Reflux.connect(JobOfferParticipantAgreementStore, "jobOfferParticipantAgreements"),
    Reflux.connect(ProgramStore, "programs"),
    Reflux.connect(PositionStore, "positions"),
    RenderLoadedMixin("jobOfferParticipantAgreements", "programs", "positions")
  ],

  componentDidMount: function () {
    JobOfferParticipantAgreementActions.ajaxLoad(GlobalActions.loadFromJobOfferParticipantAgreements);
    PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      <div id="participant-group-panels">
        {this.state.programs.map(function (program) {
          var programJobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements.filter(function (jobOfferParticipantAgreement) {
            return jobOfferParticipantAgreement.job_offer.program_id === program.id;
          });

          if (programJobOfferParticipantAgreements.length > 0) {
            return (
              <div>
                <ProgramHeader program={program} collectionName="Participant Agreements" collection={programJobOfferParticipantAgreements} />
                {programJobOfferParticipantAgreements.map(function (jobOfferParticipantAgreement) {
                  return <JobOfferParticipantAgreement jobOfferParticipantAgreement={jobOfferParticipantAgreement} key={"participant_agreement_"+program.id+"-"+jobOfferParticipantAgreement.id} />
                })}
              </div>
            )
          }
        }, this)}
      </div>
    )
  }
});
