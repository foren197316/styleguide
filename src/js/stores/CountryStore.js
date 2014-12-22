var CountryStore = Reflux.createStore({
  listenables: CountryActions,
  permission: false,

  init: function () {
  },

  onSetCountries: function (participants) {
    this.data = participants.mapAttribute("country_name").sort().uniq().map(function (countryName) {
      return { id: countryName, name: countryName };
    });

    this.permission = true;
    this.trigger(this.data);
  }
});
