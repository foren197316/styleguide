var JobOfferParticipantAgreementsPanel = React.createClass({displayName: 'JobOfferParticipantAgreementsPanel',
  mixins: [
    Reflux.connect(JobOfferParticipantAgreementStore, 'jobOfferParticipantAgreements'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    RenderLoadedMixin('jobOfferParticipantAgreements', 'programs', 'positions', 'employers', 'staffs')
  ],

  componentDidMount: function () {
    JobOfferParticipantAgreementActions.ajaxLoad(GlobalActions.loadFromJobOfferParticipantAgreements);
    PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      React.DOM.div({id: 'participant-group-panels'},
        this.state.programs.map(function (program) {
          var programJobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements.filter(function (jobOfferParticipantAgreement) {
            return jobOfferParticipantAgreement.job_offer.participant.program_id === program.id;
          });

          if (programJobOfferParticipantAgreements.length > 0) {
            return (
              React.DOM.div({key: 'program_'+program.id},
                ProgramHeader({program: program, collectionName: 'Participant Agreement', collection: programJobOfferParticipantAgreements}),
                programJobOfferParticipantAgreements.map(function (jobOfferParticipantAgreement) {
                  return JobOfferParticipantAgreement({jobOfferParticipantAgreement: jobOfferParticipantAgreement, key: 'jobOfferParticipantAgreement_'+jobOfferParticipantAgreement.id})
                })
              )
            )
          }
        }, this)
      )
    )
  }
});
