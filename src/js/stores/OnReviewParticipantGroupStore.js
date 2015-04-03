'use strict';
let Reflux = require('reflux');
let { OnReviewParticipantGroupActions } = require('../actions');

let OnReviewParticipantGroupStore = Reflux.createStore({
  resourceName: 'onReviewParticipantGroups',
  listenables: OnReviewParticipantGroupActions,

  set (onReviewParticipantGroups) {
    this.data = onReviewParticipantGroups;
    this.permission = true;
    this.trigger(this.data);
  }
});

module.exports = OnReviewParticipantGroupStore;
