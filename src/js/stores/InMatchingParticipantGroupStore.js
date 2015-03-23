/* @flow */
'use strict';
let Reflux = require('reflux');
let actions = require('../actions');
let api = require('../api');

module.exports = Reflux.createStore({
  resourceName: 'inMatchingParticipantGroups',
  listenables: actions.InMatchingParticipantGroupActions,

  onOffer (inMatchingParticipantGroup, employer, enrollment, onReviewExpiresOn, onComplete) {
    api.createOnReviewParticipantGroup(inMatchingParticipantGroup.id, employer.id, onReviewExpiresOn)
    .then(response => {
      let onReviewCount = response.data.on_review_participant_group.participants.length;
      actions.EmployerActions.updateOnReviewCount(employer.id, enrollment.id, onReviewCount);
      return response.data;
    })
    .then(onComplete);
  }
});
