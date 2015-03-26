'use strict';

let Reflux = require('reflux');
let { StaffActions } = require('../actions');

let StaffStore = Reflux.createStore({
  resourceName: 'staffs',
  listenables: StaffActions,

  onLoadFromEmployer (data) {
    let { employers } = data;
    StaffActions.ajaxLoad(employers.mapAttribute('staff_id'));
  }
});

module.exports = StaffStore;
