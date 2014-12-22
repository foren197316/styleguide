var JobOfferStore = Reflux.createStore({
  resourceName: "jobOffers",
  listenables: JobOfferActions,
  filterIds: {},

  init: function () {
  },

  initPostAjaxLoad: function (jobOffers, context) {
    switch (context) {
      case CONTEXT.JOB_OFFER:
        ParticipantActions.ajaxLoad(jobOffers.mapAttribute("participant_id"), context);
        JobOfferParticipantAgreementActions.ajaxLoad(jobOffers.mapAttribute("participant_agreement_id"), context);
        PositionActions.ajaxLoad(jobOffers.mapAttribute("position_id"), context);
        EmployerActions.ajaxLoad(jobOffers.mapAttribute("employer_id"), context);

        this.joinListener = this.joinTrailing(
          ParticipantStore,
          JobOfferParticipantAgreementStore,
          JobOfferFileMakerReferenceStore,
          ProgramStore,
          EmployerStore,
          this.aggregate
        );
        break;
      default:
        this.trigger(this.data);
    }

    JobOfferFileMakerReferenceActions.ajaxLoad(jobOffers.mapAttribute("file_maker_reference_id"), context);
  },

  aggregate: function (participantResults, jobOfferParticipantAgreementResults, jobOfferFileMakerReferenceResults, _programResults, employerResults) {
    var participants = participantResults[0];
    var jobOfferParticipantAgreements = jobOfferParticipantAgreementResults[0];
    var jobOfferFileMakerReferences = jobOfferFileMakerReferenceResults[0];
    var employers = employerResults[0];

    this.data = this.data.map(function (jobOffer) {
      jobOffer.participant = participants.findById(jobOffer.participant_id);
      jobOffer.participant_agreement = jobOfferParticipantAgreements.findById(jobOffer.participant_agreement_id);
      jobOffer.file_maker_reference = jobOfferFileMakerReferences.findById(jobOffer.file_maker_reference_id);
      jobOffer.employer = employers.findById(jobOffer.employer_id);
      return jobOffer;
    });

    NotInFileMakerStore.listen(this.filterNotInFileMaker);
    JobOfferSignedStore.listen(this.filterJobOfferSigned);
    StaffStore.listen(this.filterStaffs);

    this.trigger(this.data);
  },

  filterStaffs: function (staffs) {
    this.filterGeneric("staffs", staffs, function (staffIds, jobOffer) {
      return staffIds.indexOf(jobOffer.employer.staff_id) >= 0;
    });
  },

  filterNotInFileMaker: function (notInFileMakers) {
    var filterKey = "notInFilemaker";
    if (notInFileMakers === null || notInFileMakers.length === 0) {
      this.filterIds[filterKey] = null;
    } else {
      this.filterIds[filterKey] = this.data.reduce(function (ids, jobOffer) {
        if (!jobOffer.file_maker_reference) {
          ids.push(jobOffer.id);
        }
        return ids;
      }, []);
    }

    this.emitFilteredData();
  },

  filterJobOfferSigned: function (jobOfferSigneds) {
    var filterKey = "jobOfferSigned";
    if (jobOfferSigneds === null || jobOfferSigneds.length === 0) {
      this.filterIds[filterKey] = null;
    } else {
      this.filterIds[filterKey] = this.data.reduce(function (ids, jobOffer) {
        if (jobOffer.participant_agreement) {
          ids.push(jobOffer.id);
        }
        return ids;
      }, []);
    }

    this.emitFilteredData();
  },

  onSend: function (offeredParticipantGroupId, callback) {
    $.ajax({
      url: "/offered_participant_groups/" + offeredParticipantGroupId + "/job_offers.json",
      type: "POST",
      success: function (data) {
        this.data = this.data instanceof Array ? this.data.concat(data.job_offers) : data.job_offers;
        newJobOffer(data.job_offers, offeredParticipantGroupId);
        if (typeof callback === "function") {
          callback(data);
        }
      }.bind(this),
      error: defaultStoreError
    });
  }
});
