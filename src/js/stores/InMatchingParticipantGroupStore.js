var InMatchingParticipantGroupStore = Reflux.createStore({
  resourceName: "inMatchingParticipantGroups",
  listenables: InMatchingParticipantGroupActions,
  filterIds: {},

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
        inMatchingParticipantGroup.participant_names = participantGroup.participants.mapAttribute("name").join(",");
        inMatchingParticipantGroup.participant_start_dates = participantGroup.participants.map(function (participant) {
          return Date.parse(participant.arrival_date).add(2).days();
        });
        inMatchingParticipantGroup.participant_finish_dates = participantGroup.participants.map(function (participant) {
          return Date.parse(participant.departure_date).add(2).days();
        });
        return inMatchingParticipantGroup;
      }
      return null;
    }).notEmpty();
    // inMatchingParticipantGroupPanels = this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
      // var participantGroup = this.state.participantGroups.findById(inMatchingParticipantGroup.participant_group_id);

      // if (participantGroup === undefined || participantGroup === null) {
        // return;
      // }

      // if (this.state.participantGroupNames.mapAttribute("name").indexOf(participantGroup.name) < 0) {
        // return;
      // }

      // var participantGroupParticipants = programParticipants.findById(participantGroup.participant_ids),
          // participantGroupParticipantPositionIds = participantGroupParticipants.mapAttribute("position_ids").flatten();

      // if (!participantGroupParticipantPositionIds.intersects(this.state.positions.mapAttribute("id"))) {
        // return;
      // }

      // var participantGenders = participantGroupParticipants.mapAttribute("gender");

      // if (!this.state.genders.mapAttribute("id").intersects(participantGenders)) {
        // return;
      // }


      // var participantCountries = participantGroupParticipants.mapAttribute("country_name");

      // if (!this.state.countries.mapAttribute("name").intersects(participantCountries)) {
        // return;
      // }

      // var participantEnglishLevels = participantGroupParticipants.mapAttribute("english_level");

      // if (!this.state.englishLevels.mapAttribute("id").intersects(participantEnglishLevels)) {
        // return;
      // }

      // participantCount += participantGroupParticipants.length;

      // return <InMatchingParticipantGroupPanel
                // employer={employer}
                // enrollment={enrollment}
                // enrollments={enrollments}
                // enrollmentsLink={enrollmentsLink}
                // inMatchingParticipantGroup={inMatchingParticipantGroup}
                // key={inMatchingParticipantGroup.id}
                // participantGroup={participantGroup}
                // participants={participantGroupParticipants}
                // program={program} />;
    // }.bind(this)).notEmpty();

    // if (inMatchingParticipantGroupPanels.length > 0) {
      // return {
        // program: program,
        // inMatchingParticipantGroupPanels: inMatchingParticipantGroupPanels,
        // participantCount: participantCount
      // }
    // }
  // },
    //

    AgeAtArrivalStore.listen(this.filterAgeAtArrival);
    ParticipantGroupNameStore.listen(this.filterParticipantGroupNames);

    this.trigger(this.data);
  },

  filterAgeAtArrival: function (ageAtArrivals) {
    var filterKey = "ageAtArrivals";

    if (ageAtArrivals === null || ageAtArrivals.length === 2) {
      this.filterIds[filterKey] = null;
    } else {
      var compareFunc;

      switch (ageAtArrivals[0].id) {
        case "21_and_over":
          compareFunc = function (prev, curr) {
            return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) >= 21;
          };
          break;
        case "under_21":
          compareFunc = function (prev, curr) {
            return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) < 21;
          };
          break;
      }

      this.filterIds[filterKey] = this.data.reduce(function (ids, inMatchingParticipantGroup) {
        if (inMatchingParticipantGroup.participant_group.participants.reduce(compareFunc, false)) {
          ids.push(inMatchingParticipantGroup.id);
        }
        return ids;
      }, []);
    }

    this.emitFilteredData();
  },

  filterParticipantGroupNames: function (participantGroupNames) {
    this.filterGeneric("participantGroupNames", participantGroupNames, function (names, inMatchingParticipantGroup) {
      return names.indexOf(inMatchingParticipantGroup.participant_group.name) >= 0;
    });
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
