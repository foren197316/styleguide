'use strict';
let Reflux = require('reflux');

let CreatedByUserTypeStore = Reflux.createStore({
  permission: true,

  init () {
    this.data = ['Coordinator', 'Participant', 'Employee'].map(type => ({ id: type, name: type }));
    this.trigger(this.data);
  }
});

module.exports = CreatedByUserTypeStore;
