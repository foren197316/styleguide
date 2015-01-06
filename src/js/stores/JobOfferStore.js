var JobOfferStore = Reflux.createStore({
  resourceName: "jobOffers",
  listenables: JobOfferActions,
  filterIds: {},

  init: function () {
  },

  initPostAjaxLoad: function (jobOffers, context) {
    switch (context) {
      case CONTEXT.JOB_OFFER:
        ParticipantActions.deprecatedAjaxLoad(jobOffers.mapAttribute("participant_id"), context);
        JobOfferParticipantAgreementActions.deprecatedAjaxLoad(jobOffers.mapAttribute("participant_agreement_id"), context);
        JobOfferFileMakerReferenceActions.deprecatedAjaxLoad(jobOffers.mapAttribute("file_maker_reference_id"), context);
        PositionActions.deprecatedAjaxLoad();
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
  },

  aggregate: function (participantResults, jobOfferParticipantAgreementResults, jobOfferFileMakerReferenceResults, _programResults, employerResults) {
    this.joinListener.stop();

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

    this.trigger(this.data);
  },

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
