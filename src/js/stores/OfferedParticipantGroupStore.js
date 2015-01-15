var OfferedParticipantGroupStore = Reflux.createStore({
  resourceName: "offeredParticipantGroups",
  listenables: OfferedParticipantGroupActions,
  filterIds: {},

  initPostAjaxLoad: function () {
    this.data = this.data.map(function (offeredParticipantGroup) {
      offeredParticipantGroup.participant_names = offeredParticipantGroup.participants.mapAttribute("name").join(",");
      offeredParticipantGroup.participant_emails = offeredParticipantGroup.participants.mapAttribute("email").join(",");
      offeredParticipantGroup.participant_uuids = offeredParticipantGroup.participants.mapAttribute("uuid").join(",");
      return offeredParticipantGroup;
    });

    this.listenTo(EmployerActions.filterByIds, this.filterEmployers);
    this.listenTo(StaffActions.filterByIds, this.filterStaffs);

    this.trigger(this.data);
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

  filterPrograms: function (programIds) {
    programIds = programIds.map(parseInt);

    this.genericIdFilter("programs", programIds, function (offeredParticipantGroup) {
      return programIds.indexOf(offeredParticipantGroup.participants[0].program_id) >= 0;
    });
  },

  filterStaffs: function (staffIds) {
    staffIds = staffIds.map(parseInt);

    this.genericIdFilter("staffs", staffIds, function (offeredParticipantGroup) {
      var employer = EmployerStore.findById(offeredParticipantGroup.employer_id);
      return employer && staffIds.indexOf(employer.staff_id) >= 0;
    });
  },

  filterEmployers: function (employerIds) {
    employerIds = employerIds.map(parseInt);

    this.genericIdFilter("employers", employerIds, function (offeredParticipantGroup) {
      return employerIds.indexOf(offeredParticipantGroup.employer_id) >= 0;
    });
  }
});
