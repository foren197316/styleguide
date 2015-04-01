'use strict';
let Reflux = require('reflux');
let { OnReviewParticipantGroupActions } = require('../actions');

let OnReviewParticipantGroupStore = Reflux.createStore({
  resourceName: 'onReviewParticipantGroups',
  listenables: OnReviewParticipantGroupActions
});

module.exports = OnReviewParticipantGroupStore;
