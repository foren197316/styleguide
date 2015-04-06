'use strict';
let Reflux = require('reflux');

let CreatedByUserTypeStore = Reflux.createStore({
  permission: true,

  init () {
    this.data = [
      { id: 'Staff', name: 'Coordinator' },
      { id: 'Participant', name: 'Participant' },
      { id: 'Employee', name: 'Employer' },
    ];
    this.trigger(this.data);
  }
});

module.exports = CreatedByUserTypeStore;
