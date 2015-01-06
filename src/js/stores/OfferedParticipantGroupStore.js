var OfferedParticipantGroupStore = Reflux.createStore({
  resourceName: "offeredParticipantGroups",
  listenables: OfferedParticipantGroupActions,
  filterIds: {},

  init: function () {
    this.listenTo(GlobalActions.newJobOffer, this.onNewJobOffer);
  },

  initPostAjaxLoad: function () {
    EmployerActions.deprecatedAjaxLoad(this.data.mapAttribute("employer_id"), CONTEXT.OFFERED);
    ParticipantActions.deprecatedAjaxLoad(this.data.mapAttribute("draft_job_offers").flatten().mapAttribute("participant_id").flatten(), CONTEXT.OFFERED);

    this.joinListener = this.joinTrailing(
      EmployerStore,
      ParticipantStore,
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

        DraftJobOfferActions.removeByIds(this.data.mapAttribute("draft_job_offers").mapAttribute("id").flatten());
        ParticipantActions.removeByIds(this.data.mapAttribute("draft_job_offers").mapAttribute("participant_group_id").flatten());

        this.emitFilteredData();

        if (typeof callback === "function") {
          callback(data);
        }
      }.bind(this),
      error: defaultStoreError
    });
  },

  onNewJobOffer: function (jobOffers, offeredParticipantGroupId) {
    this.data = this.data.filter(function (offeredParticipantGroup) {
      return offeredParticipantGroup.id !== offeredParticipantGroupId;
    });

    DraftJobOfferActions.removeByIds(this.data.mapAttribute("draft_job_offers").mapAttribute("id").flatten());
    ParticipantActions.removeByIds(this.data.mapAttribute("draft_job_offers").mapAttribute("participant_group_id").flatten());

    this.emitFilteredData();
  },

  aggregate: function (
    EmployerStoreResponse,
    ParticipantStoreResponse
  ) {
    this.joinListener.stop();

    var participants = ParticipantStoreResponse[0];
    var employers = EmployerStoreResponse[0];

    this.data = this.data.map(function (offeredParticipantGroup) {
      offeredParticipantGroup.employer = employers.findById(offeredParticipantGroup.employer_id);
      offeredParticipantGroup.participants = participants.findById(offeredParticipantGroup.draft_job_offers.mapAttribute("participant_id"));
      offeredParticipantGroup.participant_names = offeredParticipantGroup.participants.mapAttribute("name").join(",");
      offeredParticipantGroup.participant_emails = offeredParticipantGroup.participants.mapAttribute("email").join(",");
      offeredParticipantGroup.participant_uuids = offeredParticipantGroup.participants.mapAttribute("uuid").join(",");
      return offeredParticipantGroup;
    });

    this.trigger(this.data);

    ProgramStore.listen(this.filterPrograms);
    StaffStore.listen(this.filterStaffs);
    EmployerStore.listen(this.filterEmployers);
  },

  filterPrograms: function (programs) {
    this.filterGeneric("programs", programs, function (programIds, offeredParticipantGroup) {
      return programIds.indexOf(offeredParticipantGroup.participants[0].program_id) >= 0;
    });
  },

  filterStaffs: function (staffs) {
    this.filterGeneric("staffs", staffs, function (staffIds, offeredParticipantGroup) {
      return staffIds.indexOf(offeredParticipantGroup.employer.staff_id) >= 0;
    });
  },

  filterEmployers: function (employers) {
    this.filterGeneric("employers", employers, function (employerIds, offeredParticipantGroup) {
      return employerIds.indexOf(offeredParticipantGroup.employer.id) >= 0;
    });
  }
});
