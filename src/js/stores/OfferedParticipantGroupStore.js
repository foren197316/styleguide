var OfferedParticipantGroupStore = Reflux.createStore({
  resourceName: "offeredParticipantGroups",
  listenables: OfferedParticipantGroupActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    DraftJobOfferActions.ajaxLoad(this.data.mapAttribute("draft_job_offer_ids").flatten());
    JobOfferActions.ajaxLoad(this.data.mapAttribute("job_offer_ids").flatten());
    EmployerActions.ajaxLoad(this.data.mapAttribute("employer_id"));
    JobOfferParticipantAgreementActions.ajaxLoad(this.data.mapAttribute("job_offer_participant_agreement_ids").flatten());
    ParticipantGroupActions.ajaxLoad(this.data.mapAttribute("participant_group_id"));

    this.joinListener = this.joinTrailing(
      DraftJobOfferStore,
      JobOfferStore,
      JobOfferParticipantAgreementStore,
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

  aggregate: function (DraftJobOfferStoreResponse, JobOfferStoreResponse, JobOfferParticipantAgreementStoreResponse, ParticipantGroupStoreResponse, EmployerStoreResponse) {
    this.joinListener.stop();

    var draftJobOffers = DraftJobOfferStoreResponse[0];
    var jobOffers = JobOfferStoreResponse[0];
    var jobOfferParticipantAgreements = JobOfferParticipantAgreementStoreResponse[0];
    var participantGroups = ParticipantGroupStoreResponse[0];
    var employers = EmployerStoreResponse[0];

    this.data = this.data.map(function (offeredParticipantGroup) {
      offeredParticipantGroup.draft_job_offers = draftJobOffers.findById(offeredParticipantGroup.draft_job_offer_ids) || [];
      offeredParticipantGroup.job_offers = draftJobOffers.findById(offeredParticipantGroup.job_offer_ids) || [];
      offeredParticipantGroup.job_offer_participant_agreements = draftJobOffers.findById(offeredParticipantGroup.job_offer_participant_agreement_ids) || [];
      offeredParticipantGroup.participant_group = participantGroups.findById(offeredParticipantGroup.participant_group_id);
      offeredParticipantGroup.employer = employers.findById(offeredParticipantGroup.employer_id);
      offeredParticipantGroup.participant_names = offeredParticipantGroup.participant_group.participants.mapAttribute("name").join(",");
      return offeredParticipantGroup;
    });

    this.trigger(this.data);
  },

  filterOfferedParticipantGroups: function (participantGroupArgs, employerArgs, offerSentArgs, participantSignedArgs) {
    var participantGroups = participantSignedArgs[0];
    var employers = employerArgs[0];
    var offerSents = offerSentArgs[0];
    // var participantSigneds = participantSignedArgs[0];

    this.data = this.data.filter(function (offeredParticipantGroup) {
      if (participantGroups.findById(offeredParticipantGroup.participant_group_id) == undefined) {
        return false;
      }

      if (employers.findById(offeredParticipantGroup.employer_id) == undefined) {
        return false;
      }

      if (offerSents.length === 1) {
        var offerSent = offerSents[0];
        var jobOffers = JobOfferStore.findById(offeredParticipantGroup.job_offer_ids);

        if (offerSent.id === "Sent" && jobOffers.length === 0) {
          return false;
        }

        if (offerSent.id === "Unsent" && jobOffers.length > 0) {
          return false;
        }
      }

      // if (participantSigneds.length === 1) {
        // var participantGroup = participantGroups.findById(offeredParticipantGroup.participant_group_id);
        // var participants = ParticipantStore.findById(participantGroup.participant_ids);
        // var participantSigned = participantSigneds[0];
        // var jobOfferParticipantAgreements = JobOfferParticipantAgreementStore.findById(offeredParticipantGroup.job_offer_participant_agreement_ids);

        // if (participantSigned.id === "Signed" && jobOfferParticipantAgreements.length !== participants.length) {
          // return false;
        // }

        // if (participantSigned.id === "Unsigned" && jobOfferParticipantAgreements.length === participants.length) {
          // return false;
        // }
      // }

      return true;
    });

    this.trigger(this.data);
  }
});
