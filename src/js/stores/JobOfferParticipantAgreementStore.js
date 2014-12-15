var JobOfferParticipantAgreementStore = Reflux.createStore({
  resourceName: "jobOfferParticipantAgreements",
  listenables: JobOfferParticipantAgreementActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  }
});
