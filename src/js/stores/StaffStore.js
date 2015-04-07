'use strict';

let Reflux = require('reflux');
let { StaffActions, loadFromJobOfferGroups, loadFromOnReviewParticipantGroups } = require('../actions');
let nameSort = require('../util/name-sort');

let StaffStore = Reflux.createStore({
  resourceName: 'staffs',
  listenables: StaffActions,

  init () {
    this.listenTo(loadFromJobOfferGroups, this.extractStaffsFromData);
    this.listenTo(loadFromOnReviewParticipantGroups, this.extractStaffsFromData);
  },

  extractStaffsFromData (data) {
    this.set(data.staffs);
  },

  onLoadFromEmployer (data) {
    let { employers } = data;
    StaffActions.ajaxLoad(employers.mapAttribute('staff_id'));
  },

  set (staffs) {
    this.permission = true;
    this.data = staffs.sort(nameSort);
    this.trigger(this.data);
  }
});

module.exports = StaffStore;
