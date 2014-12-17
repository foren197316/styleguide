var JobOfferStore = Reflux.createStore({
  resourceName: "jobOffers",
  listenables: JobOfferActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  },

  onSend: function (offeredParticipantGroupId, callback) {
    $.ajax({
      url: "/offered_participant_groups/" + offeredParticipantGroupId + "/job_offers.json",
      type: "POST",
      success: function (data) {
        this.data = this.data instanceof Array ? this.data.concat(data.job_offers) : data.job_offers;
        newJobOffer(data.job_offers, offeredParticipantGroupId);
        if (typeof callback === "function") {
          callback(data);
        }
      }.bind(this),
      error: defaultStoreError
    });
  }
});
