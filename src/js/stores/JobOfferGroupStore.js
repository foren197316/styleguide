var JobOfferGroupStore = Reflux.createStore({
  resourceName: "jobOfferGroups",
  listenables: JobOfferGroupActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  },

  onCreate: function (data, callback) {
    $.ajax({
      url: "/job_offer_groups.json",
      type: "POST",
      dataType: "json",
      data: { job_offer_group: data },
      complete: callback
    });
  }
});
