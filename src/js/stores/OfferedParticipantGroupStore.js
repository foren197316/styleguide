'use strict';

var actions = require('../actions');
var EmployerStore = require('./EmployerStore');

var OfferedParticipantGroupStore = Reflux.createStore({
  resourceName: 'offeredParticipantGroups',
  listenables: actions.OfferedParticipantGroupActions,
  filterIds: {},

  initPostAjaxLoad: function () {
    this.data = this.data.map(function (offeredParticipantGroup) {
      offeredParticipantGroup.participant_names = offeredParticipantGroup.participants.mapAttribute('name').join(',');
      offeredParticipantGroup.participant_emails = offeredParticipantGroup.participants.mapAttribute('email').join(',');
      offeredParticipantGroup.participant_uuids = offeredParticipantGroup.participants.mapAttribute('uuid').join(',');
      return offeredParticipantGroup;
    });

    this.listenTo(actions.EmployerActions.filterByIds, this.filterEmployers);
    this.listenTo(actions.StaffActions.filterByIds, this.filterStaffs);

    this.trigger(this.data);
  },

  onReject: function (offeredParticipantGroupId, callback) {
    $.ajax({
      url: '/offered_participant_groups/' + offeredParticipantGroupId,
      type: 'POST',
      data: { '_method': 'DELETE' },
      success: function (data) {
        this.data = this.data.filter(function (offeredParticipantGroup) {
          return offeredParticipantGroup.id !== offeredParticipantGroupId;
        });

        this.emitFilteredData();

        if (typeof callback === 'function') {
          callback(data);
        }
      }.bind(this),
      error: function () {
        window.location = window.location;
      }
    });
  },

  filterPrograms: function (programIds) {
    var intProgramIds = programIds.map(parseIntBase10);

    this.genericIdFilter('programs', intProgramIds, function (offeredParticipantGroup) {
      return intProgramIds.indexOf(offeredParticipantGroup.participants[0].program_id) >= 0;
    });
  },

  filterStaffs: function (staffIds) {
    var intStaffIds = staffIds.map(parseIntBase10);

    this.genericIdFilter('staffs', intStaffIds, function (offeredParticipantGroup) {
      var employer = EmployerStore.findById(offeredParticipantGroup.employer_id);
      return employer && intStaffIds.indexOf(employer.staff_id) >= 0;
    });
  },

  filterEmployers: function (employerIds) {
    var intEmployerIds = employerIds.map(parseIntBase10);

    this.genericIdFilter('employers', intEmployerIds, function (offeredParticipantGroup) {
      return intEmployerIds.indexOf(offeredParticipantGroup.employer_id) >= 0;
    });
  }
});

module.exports = OfferedParticipantGroupStore;
