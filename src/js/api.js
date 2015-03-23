'use strict';
let axios = require('axios');
let { onReviewExpiresOn } = require('./globals');

module.exports = {
  createOnReviewParticipantGroup (inMatchingParticipantGroupId, employerId) {
    let data = {
          on_review_participant_group: {
            unmatched_participant_group_id: inMatchingParticipantGroupId,
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
