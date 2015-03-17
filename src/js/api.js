'use strict';
let axios = require('axios');
let getCsrfToken = require('./csrf-token');
let { onReviewExpiresOn } = require('./globals');

module.exports = {
  createOnReviewParticipantGroup (unmatchedParticipantGroupId, employerId) {
    let data = {
          authenticity_token: getCsrfToken(),
          on_review_participant_group: {
            unmatched_participant_group_id: unmatchedParticipantGroupId,
            employer_id: employerId,
            expires_on: onReviewExpiresOn()
          }
        };

    return axios({
      url: '/on_review_participant_groups.json',
      method: 'post',
      data
    });
  }
};
