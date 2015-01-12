var EmployerStore = Reflux.createStore({
  resourceName: "employers",
  listenables: EmployerActions,

  init: function () {
    this.listenTo(GlobalActions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
    this.listenTo(GlobalActions.loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(GlobalActions.loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
    this.listenTo(GlobalActions.loadFromInMatchingParticipantGroups, this.onLoadFromInMatchingParticipantGroups);
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  },

  onLoadFromJobOfferGroups: function (jobOfferGroups) {
    EmployerActions.ajaxLoad(
      jobOfferGroups.mapAttribute("employer_id"),
      StaffActions.loadFromEmployer
    );
  },

  onLoadFromOfferedParticipantGroups: function (offeredParticipantGroups) {
    EmployerActions.ajaxLoad(
      offeredParticipantGroups.mapAttribute("employer_id"),
      StaffActions.loadFromEmployer
    );
  },

  onLoadFromJobOfferParticipantAgreements: function (jobOfferParticipantAgreements) {
    EmployerActions.ajaxLoad(
      jobOfferParticipantAgreements.mapAttribute("job_offer").mapAttribute("employer_id"),
      StaffActions.loadFromEmployer
    );
  }
});
