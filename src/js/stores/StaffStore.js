'use strict';

let Reflux = require('reflux');
let { StaffActions, loadFromJobOfferGroups } = require('../actions');

let StaffStore = Reflux.createStore({
  resourceName: 'staffs',
  listenables: StaffActions,

  init () {
    this.listenTo(loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
  },

  onLoadFromJobOfferGroups (data) {
    this.data = data.staffs;
    this.trigger(this.data);
  },

  onLoadFromEmployer (data) {
    let { employers } = data;
    StaffActions.ajaxLoad(employers.mapAttribute('staff_id'));
  }
});

module.exports = StaffStore;
