var InMatchingParticipantGroupStore = Reflux.createStore({
  resourceName: "inMatchingParticipantGroups",
  listenables: InMatchingParticipantGroupActions,
  filterIds: {},

  init: function () {
  },

  initPostAjaxLoad: function () {
    ParticipantGroupActions.deprecatedAjaxLoad(this.data.mapAttribute("participant_group_id"), CONTEXT.IN_MATCHING);
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

    AgeAtArrivalStore.listen(this.filterAgeAtArrival);
    ParticipantGroupNameStore.listen(this.filterParticipantGroupNames);
    CountryStore.listen(this.filterCountries);
    PositionStore.listen(this.filterPositions);
    GenderStore.listen(this.filterGenders);
    EnglishLevelStore.listen(this.filterEnglishLevels);
    PreviousParticipationStore.listen(this.filterPreviousParticipations);
    DriversLicenseStore.listen(this.filterDriversLicense);

    this.trigger(this.data);
  },

  filterParticipantGroupNames: function (participantGroupNames) {
    this.filterGeneric("participantGroupNames", participantGroupNames, function (names, inMatchingParticipantGroup) {
      return names.indexOf(inMatchingParticipantGroup.participant_group.name) >= 0;
    });
  },

  filterCountries: function (countries) {
    this.filterGeneric("countries", countries, function (names, inMatchingParticipantGroup) {
      return names.intersects(inMatchingParticipantGroup.participant_group.participants.mapAttribute("country_name"));
    });
  },

  filterPositions: function (positions) {
    this.filterGeneric("positions", positions, function (positionIds, inMatchingParticipantGroup) {
      return positionIds.intersects(inMatchingParticipantGroup.participant_group.participants.mapAttribute("position_ids").flatten());
    });
  },

  filterGenders: function (genders) {
    this.filterGeneric("genders", genders, function (genders, inMatchingParticipantGroup) {
      return genders.intersects(inMatchingParticipantGroup.participant_group.participants.mapAttribute("gender"));
    });
  },

  filterEnglishLevels: function (englishLevels) {
    this.filterGeneric("englishLevels", englishLevels, function (englishLevels, inMatchingParticipantGroup) {
      return englishLevels.intersects(inMatchingParticipantGroup.participant_group.participants.mapAttribute("english_level"));
    });
  },

  filterSingleton: function (filterKey, data, matchesFunc) {
    if (data === null || data.length === 0) {
      this.filterIds[filterKey] = null;
    } else {
      this.filterIds[filterKey] = this.data.reduce(function (ids, group) {
        if (matchesFunc(group)) {
          ids.push(group.id);
        }
        return ids;
      }, []);
    }

    this.emitFilteredData();
  },

  filterPreviousParticipations: function (previousParticipations) {
    this.filterSingleton("previousParticipation", previousParticipations, function (inMatchingParticipantGroup) {
      return inMatchingParticipantGroup.participant_group.participants.reduce(function (prev, curr) {
        return prev || curr.has_had_j1;
      }, false)
    });
  },

  filterDriversLicense: function (driversLicenses) {
    this.filterSingleton("driversLicenses", driversLicenses, function (inMatchingParticipantGroup) {
      return inMatchingParticipantGroup.participant_group.participants.reduce(function (prev, curr) {
        return prev || curr.has_international_drivers_license;
      }, false)
    });
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
