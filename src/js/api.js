'use strict';
let axios = require('axios');

let createOnReviewParticipantGroup = (unmatchedParticipantGroupId, employerId, onReviewExpiresOn, unmatchedId) => {
  let data = {
        on_review_participant_group: {
          employer_id: employerId,
          expires_on: onReviewExpiresOn
        }
      };

  data[unmatchedId] = unmatchedParticipantGroupId;

  return axios({
    url: '/on_review_participant_groups.json',
    method: 'post',
    data
  })
};

module.exports = {
  createOnReviewParticipantGroupFromInMatching(inMatchingParticipantGroupId, employerId, onReviewExpiresOn){
    return createOnReviewParticipantGroup(inMatchingParticipantGroupId, employerId, onReviewExpiresOn, 'in_matching_participant_group_id');
  },

  createOnReviewParticipantGroupFromReserved(reservedParticipantGroupId, employerId, onReviewExpiresOn){
    return createOnReviewParticipantGroup(reservedParticipantGroupId, employerId, onReviewExpiresOn, 'reserved_participant_group_id');
  }
};
