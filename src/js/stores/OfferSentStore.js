var OfferSentStore = Reflux.createStore({
  listenables: OfferSentActions,

  permission: false,

  init: function () {
    this.draftJobOfferListener = this.listenTo(DraftJobOfferStore, this.handlePermissions);
  },

  handlePermissions: function () {
    this.draftJobOfferListener.stop();

    if (DraftJobOfferStore.permission) {
      this.permission = true;
      this.data = [
        { id: 'Sent', name: 'Sent' },
        { id: 'Unsent', name: 'Unsent' }
      ];
    }
  }
});
