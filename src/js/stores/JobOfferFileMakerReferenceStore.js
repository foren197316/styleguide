var JobOfferFileMakerReferenceStore = Reflux.createStore({
  resourceName: "jobOfferFileMakerReferences",
  listenables: JobOfferFileMakerReferenceActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  }
});
