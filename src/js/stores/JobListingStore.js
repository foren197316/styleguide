/* @flow */
'use strict';

var Reflux = require('reflux');
var JobListingActions = require('../actions').JobListingActions;

module.exports = Reflux.createStore({
  resourceName: 'jobListings',
  listenables: JobListingActions,

  setOnReviewParticipantGroupEmployerId (onReviewParticipantGroupEmployerId) {
    this.meta.on_review_participant_group_employer_id = onReviewParticipantGroupEmployerId;
    this.trigger(this.data);
  }
});
