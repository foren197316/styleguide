var JobOfferGroupStore = Reflux.createStore({
  resourceName: "jobOfferGroups",
  listenables: JobOfferGroupActions,
  filterIds: {},

  initPostAjaxLoad: function () {
    this.data = this.data.map(function (jobOfferGroup) {
      jobOfferGroup.participant_names = jobOfferGroup.job_offers.map(function (jobOffer) {
        return jobOffer.participant.name;
      }).join(",");
      return jobOfferGroup;
    });

    this.listenTo(EmployerActions.filterByIds, this.filterEmployers);
    this.listenTo(StaffActions.filterByIds, this.filterStaffs);

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

  filterStaffs: function (staffIds) {
    staffIds = staffIds.map(parseInt);

    this.genericIdFilter("staffs", staffIds, function (jobOfferGroup) {
      var employer = EmployerStore.findById(jobOfferGroup.employer_id);
      return employer && staffIds.indexOf(employer.staff_id) >= 0;
    });
  },

  filterEmployers: function (employerIds) {
    employerIds = employerIds.map(parseInt);

    this.genericIdFilter("employers", employerIds, function (jobOfferGroup) {
      return employerIds.indexOf(jobOfferGroup.employer_id) >= 0;
    });
  },

  onCreate: function (data, callback) {
    $.ajax({
      url: "/job_offer_groups.json",
      type: "POST",
      dataType: "json",
      data: { job_offer_group: data },
      complete: callback
    });
  },

  onDestroy: function (jobOfferGroupId) {
    $.ajax({
      url: "/job_offer_groups/" + parseInt(jobOfferGroupId) + ".json",
      type: "POST",
      dataType: "json",
      data: { _method: "DELETE" },
      success: function (resp) {
        this.data = this.data.filter(function (jobOfferGroup) {
          return jobOfferGroup.id !== jobOfferGroupId;
        });
        this.emitFilteredData();
      }.bind(this),
      error: function () {
        window.location = window.location;
      }
    });
  }
});
