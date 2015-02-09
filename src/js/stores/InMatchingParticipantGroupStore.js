/* @flow */
'use strict';

var Reflux = require('reflux');
var actions = require('../actions');
var $ = require('jquery');

module.exports = Reflux.createStore({
  resourceName: 'inMatchingParticipantGroups',
  listenables: actions.InMatchingParticipantGroupActions,

  onOffer: function (inMatchingParticipantGroup, employer, enrollment, onReviewExpiresOn, onComplete) {
    $.ajax({
      url: '/on_review_participant_groups.json',
      type: 'POST',
      data: {
        on_review_participant_group: {
          in_matching_participant_group_id: inMatchingParticipantGroup.id,
          employer_id: employer.id,
          expires_on: onReviewExpiresOn
        }
      },
      dataType: 'json',
      success: function (data) {
        var onReviewCount = data.on_review_participant_group.participants.length;
        actions.EmployerActions.updateOnReviewCount(employer.id, enrollment.id, onReviewCount);
      }.bind(this),
      complete: onComplete
    });
  }
});
