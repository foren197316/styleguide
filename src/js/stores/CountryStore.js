var CountryStore = Reflux.createStore({
  listenables: CountryActions,
  permission: false,

  init: function () {
    this.listenTo(GlobalActions.loadFromInMatchingParticipantGroups, this.onLoadFromInMatchingParticipantGroups);
  },

  onLoadFromInMatchingParticipantGroups: function (inMatchingParticipantGroups) {
    this.permission = true;

    this.data = inMatchingParticipantGroups.mapAttribute("participants").flatten().mapAttribute("country_name").flatten().sort().uniq().map(function (countryName) {
      return { id: countryName, name: countryName };
    });

    this.trigger(this.data);
  }
});
