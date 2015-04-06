'use strict';
let Reflux = require('reflux');

let CreatedByUserTypeStore = Reflux.createStore({
  permission: true,

  init () {
    this.data = [
      { id: 'Employee', name: 'Employer' },
      { id: 'Participant', name: 'Participant' },
      { id: 'Staff', name: 'Coordinator' },
    ];
    this.trigger(this.data);
  }
});

module.exports = CreatedByUserTypeStore;
