var JobOfferGroupStore = Reflux.createStore({
  resourceName: "jobOfferGroups",
  listenables: JobOfferGroupActions,
  filterIds: {},

  init: function () {
  },

  initPostAjaxLoad: function () {
    var getParticipantAttrString = function (jobOfferGroup, attr) {
      return jobOfferGroup.job_offers.map(function (jobOffer) {
        return jobOffer.participant[attr];
      }).join(",");
    };

    this.data = this.data.map(function (jobOfferGroup) {
      jobOfferGroup.participant_names = getParticipantAttrString(jobOfferGroup, "name");
      return jobOfferGroup;
    });

    this.trigger(this.data);
  },

  onToggleAllSigned: function (toggle) {
    var filterKey = "jobOfferSigned";
    if (toggle) {
      this.filterIds[filterKey] = this.data.reduce(function (ids, jobOfferGroup) {
        var allSigned = jobOfferGroup.job_offers.reduce(function (prev, curr) {
                          return prev && curr.participant_agreement != undefined;
                        }, true);
        if (allSigned) {
          ids.push(jobOfferGroup.id);
        }
        return ids;
      }, []);
    } else {
      this.filterIds[filterKey] = null;
    }

    this.emitFilteredData();
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
