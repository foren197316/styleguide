var JobOfferStore = Reflux.createStore({
  resourceName: "jobOffers",
  listenables: JobOfferActions,
  filterIds: {},

  onToggleJobOfferSigned: function (toggle) {
    var filterKey = "jobOfferSigned";
    if (toggle) {
      this.filterIds[filterKey] = this.data.reduce(function (ids, jobOffer) {
        if (jobOffer.participant_agreement) {
          ids.push(jobOffer.id);
        }
        return ids;
      }, []);
    } else {
      this.filterIds[filterKey] = null;
    }

    this.emitFilteredData();
  },

  onToggleNotInFileMaker: function (toggle) {
    var filterKey = "notInFileMaker";
    if (toggle) {
      this.filterIds[filterKey] = this.data.reduce(function (ids, jobOffer) {
        if (!jobOffer.file_maker_reference) {
          ids.push(jobOffer.id);
        }
        return ids;
      }, []);
    } else {
      this.filterIds[filterKey] = null;
    }

    this.emitFilteredData();
  },

  onSend: function (offeredParticipantGroupId, callback) {
    $.ajax({
      url: "/offered_participant_groups/" + offeredParticipantGroupId + "/job_offers.json",
      type: "POST",
      success: function (data) {
        this.data = this.data instanceof Array ? this.data.concat(data.job_offers) : data.job_offers;
        GlobalActions.newJobOffer(data.job_offers, offeredParticipantGroupId);
        if (typeof callback === "function") {
          callback(data);
        }
      }.bind(this),
      error: defaultStoreError
    });
  }
});
