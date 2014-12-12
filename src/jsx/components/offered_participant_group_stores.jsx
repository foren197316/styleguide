function initStores (URLS) {

window.genericStoreActions = ["setData", "setStaticData"];

var defaultError = function () {
  window.location = window.location;
}

Reflux.StoreMethods.ajaxLoad = function (data) {
  $.ajax({
    url: URLS[this.resourceName],
    type: "GET",
    data: data,
    success: this.onLoadSuccess.bind(this),
    error: this.onLoadError.bind(this)
  });
}

Reflux.StoreMethods.onLoadSuccess = function (response) {
  var data = response[this.resourceName.camelCaseToUnderscore()];
  this.staticData = this.data = data;
  this.permission = true;
  this.trigger(this.data);

  if (typeof this.initPostAjaxListeners === "function") {
    this.initPostAjaxListeners();
  }
}

Reflux.StoreMethods.onLoadError = function (jqXHR, textStatus, errorThrown) {
  this.data = [];
  this.permission = false;
}

Reflux.StoreMethods.onSetData = function (data) {
  this.data = data;
  this.trigger(this.data);
}

Reflux.StoreMethods.onSetStaticData = function (data) {
  this.staticData = this.data = data;
  this.trigger(this.data);
}

Reflux.StoreMethods.findById = function (id, attrName) {
  return this.data.findById(id, attrName);
}

Reflux.StoreMethods.map = function (func) {
  return this.data.map(func);
}

Reflux.StoreMethods.filter = function (func) {
  return this.data.filter(func);
}

Reflux.StoreMethods.mapAttribute = function (func) {
  return this.data.mapAttribute(func);
}

window.OfferedParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(
  ["reject"]
));

window.OfferedParticipantGroupStore = Reflux.createStore({
  resourceName: "offeredParticipantGroups",

  init: function () {
    this.ajaxLoad();
    this.listenToMany(OfferedParticipantGroupActions);
  },

  initPostAjaxListeners: function () {
    this.filterListener = this.joinLeading(ParticipantGroupStore, EmployerStore, function () {
      this.filterListener.stop();
      this.listenTo(ParticipantGroupStore, this.filterOfferedParticipantGroups);
      this.listenTo(EmployerStore, this.filterOfferedParticipantGroups);
    }.bind(this));
  },

  onReject: function (offeredParticipantGroupId, callback) {
    $.ajax({
      url: "/offered_participant_groups/" + offeredParticipantGroupId,
      type: "POST",
      data: { "_method": "DELETE" },
      success: function (data) {
        this.staticData = this.data = this.data.filter(function (offeredParticipantGroup) {
          return offeredParticipantGroup.id !== offeredParticipantGroupId;
        });

        this.trigger(this.data);

        if (typeof callback === "function") {
          callback(data);
        }
      }.bind(this),
      error: defaultError
    });
  },

  filterOfferedParticipantGroups: function () {
    this.data = this.staticData.filter(function (offeredParticipantGroup) {
      return (ParticipantGroupStore.findById(offeredParticipantGroup.participant_group_id) != undefined)
          && (EmployerStore.findById(offeredParticipantGroup.employer_id) != undefined);
    });

    this.trigger(this.data);
  }
});

window.ParticipantGroupActions = Reflux.createActions(genericStoreActions);

window.ParticipantGroupStore = Reflux.createStore({
  resourceName: "participantGroups",

  init: function () {
    this.listener = this.listenTo(OfferedParticipantGroupStore, this.load);
    this.listenToMany(ParticipantGroupActions);
  },

  initPostAjaxListeners: function () {
    this.listenTo(ParticipantStore, this.onParticipantStore);
  },

  load: function (offeredParticipantGroups) {
    this.listener.stop();
    this.ajaxLoad({
      ids: offeredParticipantGroups.mapAttribute("participant_group_id")
    });
  },

  onParticipantStore: function (participants) {
    this.data = this.staticData.filter(function (participantGroup) {
      return participants.findById(participantGroup.participant_ids).length > 0;
    });

    this.trigger(this.data);
  }
});

window.ParticipantActions = Reflux.createActions(genericStoreActions);

window.ParticipantStore = Reflux.createStore({
  resourceName: "participants",

  init: function () {
    this.groupListener = this.joinLeading(OfferedParticipantGroupStore, ParticipantGroupStore, this.load);
    this.listenToMany(ParticipantActions);
  },

  initPostAjaxListeners: function () {
    this.setParticipantNames();
    this.listenTo(ProgramStore, this.onProgramStore);
  },

  load: function (offeredParticipantGroupResults, participantGroupResults) {
    this.groupListener.stop();
    this.ajaxLoad({
      ids: participantGroupResults[0].mapAttribute("participant_ids").flatten()
    });
  },

  setParticipantNames: function (participants, participantGroups) {
    var participants = this.data;

    var offeredParticipantGroupsWithNames = OfferedParticipantGroupStore.map(function (offeredParticipantGroup) {
      var participantGroup = ParticipantGroupStore.findById(offeredParticipantGroup.participant_group_id);
      var offeredParticipants = participants.findById(participantGroup.participant_ids);
      offeredParticipantGroup.participant_names = offeredParticipants.mapAttribute("name").join(",");
      return offeredParticipantGroup;
    });

    OfferedParticipantGroupActions.setStaticData(offeredParticipantGroupsWithNames);
  },

  onProgramStore: function (programs) {
    this.data = this.staticData.filter(function (participant) {
      return programs.findById(participant.program_id) != null;
    });

    this.trigger(this.data);
  }
});

window.ProgramActions = Reflux.createActions(genericStoreActions);

window.ProgramStore = Reflux.createStore({
  resourceName: "programs",
  listenables: ProgramActions,

  init: function () {
    this.participantListener = this.listenTo(ParticipantStore, this.load);
  },

  load: function (participants) {
    this.participantListener.stop();
    this.ajaxLoad({
      ids: participants.mapAttribute("program_id")
    });
  }
});

window.EmployerActions = Reflux.createActions(genericStoreActions);

window.EmployerStore = Reflux.createStore({
  resourceName: "employers",
  listenables: EmployerActions,

  init: function () {
    this.offeredParticipantGroupListener = this.listenTo(OfferedParticipantGroupStore, this.load);
  },

  initPostAjaxListeners: function () {
    this.listenTo(StaffStore, this.onStaffStore);
  },

  load: function (offeredParticipantGroups) {
    this.offeredParticipantGroupListener.stop();
    this.ajaxLoad({
      ids: offeredParticipantGroups.mapAttribute("employer_id")
    });
  },

  onStaffStore: function (staffs) {
    this.data = this.staticData.filter(function (employer) {
      return staffs.findById(employer.staff_id) != null;
    });

    this.trigger(this.data);
  }
});

window.StaffActions = Reflux.createActions(genericStoreActions.concat(
  ["setAllUnselectedState"]
));

window.StaffStore = Reflux.createStore({
  resourceName: "staffs",
  listenables: StaffActions,

  allUnselected: true,

  init: function () {
    this.employerListener = this.listenTo(EmployerStore, this.load);
  },

  load: function (employers) {
    this.employerListener.stop();
    this.ajaxLoad({
      ids: employers.mapAttribute("staff_id")
    });
  },

  onSetAllUnselectedState: function (state) {
    this.allUnselected = state;
  }
});

window.DraftJobOfferActions = Reflux.createActions(genericStoreActions);

window.DraftJobOfferStore = Reflux.createStore({
  resourceName: "draftJobOffers",
  listenables: DraftJobOfferActions,

  init: function () {
    this.offeredParticipantGroupListener = this.listenTo(OfferedParticipantGroupStore, this.load);
  },

  load: function (offeredParticipantGroups) {
    this.offeredParticipantGroupListener.stop();
    this.ajaxLoad({
      ids: offeredParticipantGroups.mapAttribute("draft_job_offer_ids").flatten()
    });
  }
});

window.JobOfferActions = Reflux.createActions(genericStoreActions.concat(
  ["send"]
));

window.JobOfferStore = Reflux.createStore({
  resourceName: "jobOffers",
  listenables: JobOfferActions,

  init: function () {
    this.offeredParticipantGroupListener = this.listenTo(OfferedParticipantGroupStore, this.load);
  },

  load: function (offeredParticipantGroups) {
    this.offeredParticipantGroupListener.stop();
    this.ajaxLoad({
      ids: offeredParticipantGroups.mapAttribute("job_offer_ids").flatten()
    });
  },

  onSend: function (offeredParticipantGroupId, callback) {
    $.ajax({
      url: "/offered_participant_groups/" + offeredParticipantGroupId + "/job_offers.json",
      type: "POST",
      success: function (data) {
        this.data = this.data instanceof Array ? this.data.concat(data.job_offers) : data.job_offers;
        this.trigger(this.data);
        if (typeof callback === "function") {
          callback(data);
        }
      }.bind(this),
      error: defaultError
    });
  }
});

window.JobOfferParticipantAgreementActions = Reflux.createActions(genericStoreActions);

window.JobOfferParticipantAgreementStore = Reflux.createStore({
  resourceName: "jobOfferParticipantAgreements",
  listenables: JobOfferParticipantAgreementActions,

  init: function () {
    this.offeredParticipantGroupListener = this.listenTo(OfferedParticipantGroupStore, this.load);
  },

  load: function (offeredParticipantGroups) {
    this.offeredParticipantGroupListener.stop();
    this.ajaxLoad({
      ids: offeredParticipantGroups.mapAttribute("job_offer_participant_agreement_ids").flatten()
    });
  }
});

window.PositionActions = Reflux.createActions(genericStoreActions);

window.PositionStore = Reflux.createStore({
  resourceName: "positions",
  listenables: PositionActions,

  init: function () {
    this.ajaxLoad();
  }
});

}
