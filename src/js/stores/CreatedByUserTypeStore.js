'use strict';
let Reflux = require('reflux');

let CreatedByUserTypeStore = Reflux.createStore({
  permission: true,

  init () {
    this.data = [
      { id: 'Staff', name: 'Coordinator' },
      { id: 'Employee', name: 'Employer' },
      { id: 'Participant', name: 'Participant' },
    ];
    this.trigger(this.data);
  }
});

module.exports = CreatedByUserTypeStore;
