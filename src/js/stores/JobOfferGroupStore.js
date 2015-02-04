'use strict';

var Reflux = require('reflux');
var actions = require('../actions');
var parseIntBase10 = require('../globals').parseIntBase10;
var EmployerStore = require('./EmployerStore');

var JobOfferGroupStore = Reflux.createStore({
  resourceName: 'jobOfferGroups',
  listenables: actions.JobOfferGroupActions,
  filterIds: {},

  initPostAjaxLoad: function () {
    this.data = this.data.map(function (jobOfferGroup) {
      jobOfferGroup.participant_names = jobOfferGroup.job_offers.map(function (jobOffer) {
        return jobOffer.participant.name;
      }).join(',');
      return jobOfferGroup;
    });

    this.listenTo(actions.EmployerActions.filterByIds, this.filterEmployers);
    this.listenTo(actions.StaffActions.filterByIds, this.filterStaffs);
    this.listenTo(actions.JobOfferSignedActions.filterByIds, this.filterJobOfferSigneds);

    this.trigger(this.data);
  },

  filterEmployers: function (employerIds) {
    var intEmployerIds = employerIds.map(parseIntBase10);

    this.genericIdFilter('employers', intEmployerIds, function (jobOfferGroup) {
      return intEmployerIds.indexOf(jobOfferGroup.employer_id) >= 0;
    });
  },

  filterStaffs: function (staffIds) {
    var intStaffIds = staffIds.map(parseIntBase10);

    this.genericIdFilter('staffs', intStaffIds, function (jobOfferGroup) {
      var employer = EmployerStore.findById(jobOfferGroup.employer_id);
      return employer && intStaffIds.indexOf(employer.staff_id) >= 0;
    });
  },

  filterJobOfferSigneds: function (jobOfferSigneds) {
    var filterKey = 'jobOfferSigneds';

    if (jobOfferSigneds.length === 2 || jobOfferSigneds.length === 0) {
      this.filterIds[filterKey] = null;
    } else {
      switch (jobOfferSigneds[0]) {
        case 'All Signed':
          this.filterIds[filterKey] = this.data.reduce(function (ids, jobOfferGroup) {
            var allSigned = jobOfferGroup.job_offers.reduce(function (prev, curr) {
              return prev && curr.participant_agreement !== null;
            }, true);

            if (allSigned) {
              ids.push(jobOfferGroup.id);
            }
            return ids;
          }, []);
          break;
        case 'Any Unsigned':
          this.filterIds[filterKey] = this.data.reduce(function (ids, jobOfferGroup) {
            var anyUnsigned = jobOfferGroup.job_offers.reduce(function (prev, curr) {
              return prev || curr.participant_agreement === null;
            }, false);

            if (anyUnsigned) {
              ids.push(jobOfferGroup.id);
            }
            return ids;
          }, []);
          break;
      }
    }

    this.emitFilteredData();
  },

  onCreate: function (data, callback) {
    $.ajax({
      url: '/job_offer_groups.json',
      type: 'POST',
      dataType: 'json',
      data: { job_offer_group: data },
      complete: callback
    });
  },

  onDestroy: function (jobOfferGroupId) {
    $.ajax({
      url: '/job_offer_groups/' + parseInt(jobOfferGroupId) + '.json',
      type: 'POST',
      dataType: 'json',
      data: { _method: 'DELETE' },
      success: function () {
        this.data = this.data.filter(function (jobOfferGroup) {
          return jobOfferGroup.id !== jobOfferGroupId;
        });
        this.emitFilteredData();
      }.bind(this),
      error: function () {
        global.location = global.location;
      }
    });
  }
});

module.exports = JobOfferGroupStore;
