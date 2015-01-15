var JobOfferParticipantAgreementStore = Reflux.createStore({
  resourceName: 'jobOfferParticipantAgreements',
  listenables: JobOfferParticipantAgreementActions,
  filterIds: {},

  toggleNotInFileMaker: function (toggle) {
    var filterKey = 'notInFileMaker';
    if (toggle) {
      this.filterIds[filterKey] = this.data.reduce(function (ids, jobOfferParticipantAgreement) {
        if (!jobOfferParticipantAgreement.job_offer.file_maker_reference) {
          ids.push(jobOfferParticipantAgreement.id);
        }
        return ids;
      }, []);
    } else {
      this.filterIds[filterKey] = null;
    }

    this.emitFilteredData();
  }
});
