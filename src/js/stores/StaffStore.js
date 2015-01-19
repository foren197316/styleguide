'use strict';



var StaffStore = Reflux.createStore({
  resourceName: 'staffs',
  listenables: StaffActions,

  onLoadFromEmployer: function (employers) {
    StaffActions.ajaxLoad(employers.mapAttribute('staff_id'));
  }
});

module.exports = StaffStore;
