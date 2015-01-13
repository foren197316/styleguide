var ParticipantGroupNameStore = Reflux.createStore({
  listenables: ParticipantGroupNameActions,
  permission: false,

  init: function () {
    this.listenTo(GlobalActions.loadFromInMatchingParticipantGroups, this.onLoadFromInMatchingParticipantGroups);
  },

  onLoadFromInMatchingParticipantGroups: function (inMatchingParticipantGroups) {
    this.permission = true;

    this.data = inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
      return inMatchingParticipantGroup.name;
    }).sort().uniq().map(function (name) {
      return {
        id: name,
        name: name
      };
    });;

    this.trigger(this.data);
  }
});
