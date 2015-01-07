var ProgramStore = Reflux.createStore({
  resourceName: "programs",
  listenables: ProgramActions,
  applicableIds: null,

  init: function () {
    this.listenTo(GlobalActions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
  },

  initPostAjaxLoad: function () {
    if (this.applicableIds !== null) {
      this.data = this.data.filter(function (program) {
        return this.applicableIds.indexOf(program.id) >= 0;
      }, this);
    }

    this.trigger(this.data);
  },

  onLoadFromJobOfferGroups: function (jobOfferGroups) {
    this.applicableIds = jobOfferGroups.map(function (jobOfferGroup) {
      return jobOfferGroup.job_offers[0].participant.program_id;
    }).uniq();

    ProgramActions.ajaxLoad();
  }
});
