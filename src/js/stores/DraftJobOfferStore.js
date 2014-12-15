var DraftJobOfferStore = Reflux.createStore({
  resourceName: "draftJobOffers",
  listenables: DraftJobOfferActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  }
});
