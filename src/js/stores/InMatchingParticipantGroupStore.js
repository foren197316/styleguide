var InMatchingParticipantGroupStore = Reflux.createStore({
  resourceName: "inMatchingParticipantGroups",
  listenables: InMatchingParticipantGroupActions,
  filterIds: {},

  initPostAjaxLoad: function () {
    this.data = this.data.map(function (inMatchingParticipantGroup) {
      inMatchingParticipantGroup.participant_names = inMatchingParticipantGroup.participants.mapAttribute("name").join(",");
      inMatchingParticipantGroup.participant_start_dates = inMatchingParticipantGroup.participants.map(function (participant) {
        return Date.parse(participant.arrival_date).add(2).days();
      });
      inMatchingParticipantGroup.participant_finish_dates = inMatchingParticipantGroup.participants.map(function (participant) {
        return Date.parse(participant.departure_date).add(2).days();
      });
      return inMatchingParticipantGroup;
    });

    this.listenTo(AgeAtArrivalActions.filterByIds, this.filterAgeAtArrival);
    this.listenTo(ParticipantGroupNameActions.filterByIds, this.filterParticipantGroupNames);
    this.listenTo(GenderActions.filterByIds, this.filterGenders);
    this.listenTo(EnglishLevelActions.filterByIds, this.filterEnglishLevels);

    this.trigger(this.data);
  },

  filterAgeAtArrival: function (ageAtArrivals) {
    var filterKey = "ageAtArrivals";

    if (ageAtArrivals.length === 2 || ageAtArrivals.length === 0) {
      this.filterIds[filterKey] = null;
    } else {
      var compareFunc;

      switch (ageAtArrivals[0]) {
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
        if (inMatchingParticipantGroup.participants.reduce(compareFunc, false)) {
          ids.push(inMatchingParticipantGroup.id);
        }
        return ids;
      }, []);
    }

    this.emitFilteredData();
  },

  filterParticipantGroupNames: function (participantGroupNames) {
    this.genericIdFilter("participantGroupNames", participantGroupNames, function (inMatchingParticipantGroup) {
      return participantGroupNames.indexOf(inMatchingParticipantGroup.name) >= 0;
    });
  },

  filterGenders: function (genders) {
    this.genericIdFilter("genders", genders, function (inMatchingParticipantGroup) {
      return genders.intersects(inMatchingParticipantGroup.participants.mapAttribute("gender"));
    });
  },

  filterEnglishLevels: function (englishLevels) {
    englishLevels = englishLevels.map(parseInt);

    this.genericIdFilter("englishLevels", englishLevels, function (inMatchingParticipantGroup) {
      return englishLevels.intersects(inMatchingParticipantGroup.participants.mapAttribute("english_level"));
    });
  },

  filterCountries: function (countries) {
    this.filterGeneric("countries", countries, function (names, inMatchingParticipantGroup) {
      return names.intersects(inMatchingParticipantGroup.participants.mapAttribute("country_name"));
    });
  },

  filterPositions: function (positions) {
    this.filterGeneric("positions", positions, function (positionIds, inMatchingParticipantGroup) {
      return positionIds.intersects(inMatchingParticipantGroup.participants.mapAttribute("position_ids").flatten());
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

  onToggleInternationalDriversLicense: function (toggle) {
    var filterKey = "internationalDriversLicense";
    if (toggle) {
      this.filterIds[filterKey] = this.data.reduce(function (ids, inMatchingParticipantGroup) {
        var hasInternationalDriversLicense = inMatchingParticipantGroup.participants.reduce(function (prev, curr) {
          return prev || curr.has_international_drivers_license;
        }, false);

        if (hasInternationalDriversLicense) {
          ids.push(inMatchingParticipantGroup.id);
        }
        return ids;
      }, []);
    } else {
      this.filterIds[filterKey] = null;
    }

    this.emitFilteredData();
  },

  onTogglePreviousParticipation: function (toggle) {
    var filterKey = "previousParticipation";
    if (toggle) {
      this.filterIds[filterKey] = this.data.reduce(function (ids, inMatchingParticipantGroup) {
        var hasHadJ1 = inMatchingParticipantGroup.participants.reduce(function (prev, curr) {
          return prev || curr.has_had_j1;
        }, false);

        if (hasHadJ1) {
          ids.push(inMatchingParticipantGroup.id);
        }
        return ids;
      }, []);
    } else {
      this.filterIds[filterKey] = null;
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
