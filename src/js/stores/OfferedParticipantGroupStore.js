var OfferedParticipantGroupStore = Reflux.createStore({
  resourceName: "offeredParticipantGroups",
  listenables: OfferedParticipantGroupActions,
  filterIds: {},

  init: function () {
  },

  initPostAjaxLoad: function () {
    DraftJobOfferActions.ajaxLoad(this.data.mapAttribute("draft_job_offer_ids").flatten());
    JobOfferActions.ajaxLoad(this.data.mapAttribute("job_offer_ids").flatten());
    EmployerActions.ajaxLoad(this.data.mapAttribute("employer_id"));
    JobOfferParticipantAgreementActions.ajaxLoad(this.data.mapAttribute("job_offer_participant_agreement_ids").flatten());
    JobOfferFileMakerReferenceActions.ajaxLoad(this.data.mapAttribute("job_offer_file_maker_reference_ids").flatten());
    ParticipantGroupActions.ajaxLoad(this.data.mapAttribute("participant_group_id"));

    this.joinListener = this.joinTrailing(
      DraftJobOfferStore,
      JobOfferStore,
      JobOfferParticipantAgreementStore,
      JobOfferFileMakerReferenceStore,
      ParticipantGroupStore,
      EmployerStore,
      this.aggregate
    );
  },

  onReject: function (offeredParticipantGroupId, callback) {
    $.ajax({
      url: "/offered_participant_groups/" + offeredParticipantGroupId,
      type: "POST",
      data: { "_method": "DELETE" },
      success: function (data) {
        this.data = this.data.filter(function (offeredParticipantGroup) {
          return offeredParticipantGroup.id !== offeredParticipantGroupId;
        });

        this.trigger(this.data);

        if (typeof callback === "function") {
          callback(data);
        }
      }.bind(this),
      error: defaultStoreError
    });
  },

  aggregate: function (
    DraftJobOfferStoreResponse,
    JobOfferStoreResponse,
    JobOfferParticipantAgreementStoreResponse,
    JobOfferFileMakerReferenceStoreResponse,
    ParticipantGroupStoreResponse,
    EmployerStoreResponse
  ) {
    this.joinListener.stop();

    var draftJobOffers = DraftJobOfferStoreResponse[0];
    var jobOffers = JobOfferStoreResponse[0];
    var jobOfferParticipantAgreements = JobOfferParticipantAgreementStoreResponse[0];
    var jobOfferFileMakerReferences = JobOfferFileMakerReferenceStoreResponse[0];
    var participantGroups = ParticipantGroupStoreResponse[0];
    var employers = EmployerStoreResponse[0];

    this.data = this.data.map(function (offeredParticipantGroup) {
      offeredParticipantGroup.draft_job_offers = draftJobOffers.findById(offeredParticipantGroup.draft_job_offer_ids) || [];
      offeredParticipantGroup.job_offers = jobOffers.findById(offeredParticipantGroup.job_offer_ids) || [];
      offeredParticipantGroup.job_offer_participant_agreements = jobOfferParticipantAgreements.findById(offeredParticipantGroup.job_offer_participant_agreement_ids) || [];
      offeredParticipantGroup.job_offer_file_maker_references = jobOfferFileMakerReferences.findById(offeredParticipantGroup.job_offer_file_maker_reference_ids) || [];
      offeredParticipantGroup.participant_group = participantGroups.findById(offeredParticipantGroup.participant_group_id);
      offeredParticipantGroup.employer = employers.findById(offeredParticipantGroup.employer_id);
      offeredParticipantGroup.participant_names = offeredParticipantGroup.participant_group.participants.mapAttribute("name").join(",");
      offeredParticipantGroup.participant_email = offeredParticipantGroup.participant_group.participants.mapAttribute("email").join(",");
      offeredParticipantGroup.participant_uuids = offeredParticipantGroup.participant_group.participants.mapAttribute("uuid").join(",");
      return offeredParticipantGroup;
    });

    this.trigger(this.data);

    ProgramStore.listen(this.filterPrograms);
    ParticipantSignedStore.listen(this.filterParticipantSigned);
    OfferSentStore.listen(this.filterOfferSent);
  },

  filterPrograms: function (programs) {
    if (programs === null) {
      this.filterIds["program"] = null;
    } else {
      var program_ids = programs.mapAttribute("id");

      this.filterIds["programs"] = this.data.reduce(function (ids, offeredParticipantGroup) {
        if (program_ids.indexOf(offeredParticipantGroup.participant_group.participants[0].program_id) >= 0) {
          ids.push(offeredParticipantGroup.id);
        }
        return ids;
      }, []);
    }

    this.emitFilteredData();
  },

  filterParticipantSigned: function (participantSigneds) {
    if (participantSigneds === null || participantSigneds.length === 2) {
      this.filterIds["participantSigned"] = null;
    } else {
      var key = participantSigneds[0].id;
      var compareFunc;

      switch (key) {
        case "Signed":
          compareFunc = function (offeredParticipantGroup) {
            return offeredParticipantGroup.job_offer_participant_agreements.length === offeredParticipantGroup.participant_group.participants.length;
          }
          break;
        case "Unsigned":
          compareFunc = function (offeredParticipantGroup) {
            return offeredParticipantGroup.job_offer_participant_agreements.length !== offeredParticipantGroup.participant_group.participants.length;
          }
      }

      this.filterIds["participantSigned"] = this.data.reduce(function (ids, offeredParticipantGroup) {
        if (compareFunc(offeredParticipantGroup)) {
          ids.push(offeredParticipantGroup.id);
        }
        return ids;
      }, []);
    }

    this.emitFilteredData();
  },

  filterOfferSent: function (offerSents) {
    if (offerSents === null || offerSents.length === 2) {
      this.filterIds["offerSent"] = null;
    } else {
      var key = offerSents[0].id;
      var compareFunc;

      switch (key) {
        case "Sent":
          compareFunc = function (offeredParticipantGroup) {
            return offeredParticipantGroup.job_offers.length > 0;
          }
          break;
        case "Unsent":
          compareFunc = function (offeredParticipantGroup) {
            return offeredParticipantGroup.job_offers.length === 0;
          }
      }

      this.filterIds["offerSent"] = this.data.reduce(function (ids, offeredParticipantGroup) {
        if (compareFunc(offeredParticipantGroup)) {
          ids.push(offeredParticipantGroup.id);
        }
        return ids;
      }, []);
    }

    this.emitFilteredData();
  }
});
