var PreviousParticipationStore = Reflux.createStore({
  listenables: PreviousParticipationActions,
  permission: true,

  init: function () {
    this.data = [
      { id: "true", name: "Returning Participant" }
    ]
  }
});
