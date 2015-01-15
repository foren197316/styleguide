var InMatchingParticipantGroupStore = Reflux.createStore({
  resourceName: 'inMatchingParticipantGroups',
  listenables: InMatchingParticipantGroupActions,
  filterIds: {},

  initPostAjaxLoad: function () {
    this.data = this.data.map(function (inMatchingParticipantGroup) {
      inMatchingParticipantGroup.participant_names = inMatchingParticipantGroup.participants.mapAttribute('name').join(',');
      inMatchingParticipantGroup.participant_start_dates = inMatchingParticipantGroup.participants.map(function (participant) {
        return Date.parse(participant.arrival_date).add(2).days();
      });
      inMatchingParticipantGroup.participant_finish_dates = inMatchingParticipantGroup.participants.map(function (participant) {
        return Date.parse(participant.departure_date).add(2).days();
      });
      return inMatchingParticipantGroup;
    });

    this.initFilters();
    this.trigger(this.data);
  },

  initFilters: function () {
    this.listenTo(AgeAtArrivalActions.filterByIds, this.filterAgeAtArrival);
    this.listenTo(ParticipantGroupNameActions.filterByIds, this.filterParticipantGroupNames);
    this.listenTo(GenderActions.filterByIds, this.filterGenders);
    this.listenTo(EnglishLevelActions.filterByIds, this.filterEnglishLevels);
    this.listenTo(PositionActions.filterByIds, this.filterPositions);
    this.listenTo(CountryActions.filterByIds, this.filterCountries);

    this.trigger(this.data);
  },

  filterAgeAtArrival: function (ageAtArrivals) {
    var filterKey = 'ageAtArrivals';

    if (ageAtArrivals.length === 2 || ageAtArrivals.length === 0) {
      this.filterIds[filterKey] = null;
    } else {
      var compareFunc;

      switch (ageAtArrivals[0]) {
        case '21_and_over':
          compareFunc = function (prev, curr) {
            return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) >= 21;
          };
          break;
        case 'under_21':
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
    this.genericIdFilter('participantGroupNames', participantGroupNames, function (inMatchingParticipantGroup) {
      return participantGroupNames.indexOf(inMatchingParticipantGroup.name) >= 0;
    });
  },

  filterGenders: function (genders) {
    this.genericIdFilter('genders', genders, function (inMatchingParticipantGroup) {
      return genders.intersects(inMatchingParticipantGroup.participants.mapAttribute('gender'));
    });
  },

  filterEnglishLevels: function (englishLevels) {
    var intEnglishLevels = englishLevels.map(parseIntBase10);

    this.genericIdFilter('englishLevels', intEnglishLevels, function (inMatchingParticipantGroup) {
      return intEnglishLevels.intersects(inMatchingParticipantGroup.participants.mapAttribute('english_level'));
    });
  },

  filterPositions: function (positionIds) {
    var intPositionIds = positionIds.map(parseIntBase10);

    this.genericIdFilter('positions', intPositionIds, function (inMatchingParticipantGroup) {
      return intPositionIds.intersects(inMatchingParticipantGroup.participants.mapAttribute('position_ids').flatten());
    });
  },

  filterCountries: function (countryNames) {
    this.genericIdFilter('countries', countryNames, function (inMatchingParticipantGroup) {
      return countryNames.intersects(inMatchingParticipantGroup.participants.mapAttribute('country_name'));
    });
  },

  onTogglePreviousParticipation: function (toggle) {
    var filterKey = 'previousParticipation';
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

  onToggleInternationalDriversLicense: function (toggle) {
    var filterKey = 'internationalDriversLicense';
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
        EmployerActions.updateOnReviewCount(employer.id, enrollment.id, onReviewCount);
      }.bind(this),
      complete: onComplete
    });
  }
});
