var ParticipantGroupNameStore = Reflux.createStore({
  listenables: ParticipantGroupNameActions,
  permission: true,

  init: function () {
  },

  onSetNames: function (participantGroups) {
    this.data = participantGroups.mapAttribute("name").sort().uniq().map(function (participantGroupName) {
      return { id: participantGroupName, name: participantGroupName };
    });
  }
});
