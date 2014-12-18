var InMatchingParticipantGroupStore = Reflux.createStore({
  resourceName: "inMatchingParticipantGroups",
  listenables: InMatchingParticipantGroupActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    ParticipantGroupActions.ajaxLoad(this.data.mapAttribute("participant_group_id"), CONTEXT.IN_MATCHING);
    this.participantGroupListener = this.listenTo(ParticipantGroupStore, this.aggregateAndFilter);
  },

  aggregateAndFilter: function (participantGroups) {
    this.participantGroupListener.stop();

    this.data = this.data.map(function (inMatchingParticipantGroup) {
      var participantGroup = participantGroups.findById(inMatchingParticipantGroup.participant_group_id)
      if (participantGroup) {
        inMatchingParticipantGroup.participant_group = participantGroup;
        return inMatchingParticipantGroup;
      }
      return null;
    }).notEmpty();

    this.trigger(this.data);
  },

  onOffer: function (inMatchingParticipantGroup, employer, enrollment, onReviewExpiresOn, onComplete) {
    $.ajax({
      url: "/on_review_participant_groups.json",
      type: "POST",
      data: {
        on_review_participant_group: {
          in_matching_participant_group_id: inMatchingParticipantGroup.id,
          employer_id: employer.id,
          expires_on: onReviewExpiresOn
        }
      },
      dataType: "json",
      success: function (data) {
        var onReviewCount = data.on_review_participant_group.participants.length;
        EnrollmentActions.updateOnReviewCount(enrollment.id, onReviewCount);
      },
      complete: onComplete
    });
  }
});
