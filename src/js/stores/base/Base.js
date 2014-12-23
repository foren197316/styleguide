var CONTEXT = {
  IN_MATCHING: 1,
  OFFERED:     2,
  JOB_OFFER:   3
}

var genericStoreActions    = ["setData", "ajaxLoad", "filterByIds", "forceTrigger", "removeByIds", "setSingleton"];
var filterableStoreActions = ["search", "resetSearch", "dateFilter"];

var defaultStoreError = function () {
  window.location = window.location;
}

var dateGreaterThan = function (dateList, comparisonDate) {
  return dateList.reduce(function (prev, curr) {
    return prev || Date.compare(curr, comparisonDate) >= 0;
  }, false);
}

var dateLessThan = function (dateList, comparisonDate) {
  return dateList.reduce(function (prev, curr) {
    return prev || Date.compare(curr, comparisonDate) <= 0;
  }, false);
}

var traverse = function (subject, attributes) {
  var curr = subject;

  if (typeof attributes === "string") {
    return curr[attributes];
  }

  for (var i=0; i<attributes.length; i++) {
    if (!curr) {
      return null;
    }
    curr = curr[attributes[i]];
  }

  return curr;
}

/**
 * You can pass arbitrary arguments to `ajaxLoad` and they will
 * be passed on to `initPostAjaxLoad` along with the AJAX response.
 */
Reflux.StoreMethods.onAjaxLoad = function (ids) {
  var data = ids instanceof Array ? { ids: ids.notEmpty().sort().uniq() } : null;
  var args = arguments;

  $.ajax({
    url: window.RESOURCE_URLS[this.resourceName],
    type: "GET",
    data: data,
    success: function (response) {
      [].shift.call(args);
      [].unshift.call(args, response);
      this.onLoadSuccess.apply(this, args);
    }.bind(this),
    error: this.onLoadError.bind(this)
  });
}

Reflux.StoreMethods.onLoadSuccess = function (response) {
  var args = arguments;

  this.data = response[this.resourceName.camelCaseToUnderscore()];

  if (!(this.data instanceof Array)) {
    this.data = [this.data].notEmpty();
  }

  this.permission = true;

  if (typeof this.initPostAjaxLoad === "function") {
    [].shift.call(args);
    [].unshift.call(args, this.data);
    this.initPostAjaxLoad.apply(this, args);
  }
}

Reflux.StoreMethods.onLoadError = function (jqXHR, textStatus, errorThrown) {
  this.data = [];
  this.permission = false;
}

Reflux.StoreMethods.filterGeneric = function (filterKey, data, condition) {
  if (data === null) {
    this.filterIds[filterKey] = null;
  } else {
    var data_ids = data.mapAttribute("id");

    this.filterIds[filterKey] = this.data.reduce(function (ids, entry) {
      if (condition(data_ids, entry)) {
        ids.push(entry.id);
      }
      return ids;
    }, []);
  }

  this.emitFilteredData();
}

Reflux.StoreMethods.onSetData = function (data) {
  this.data = data;
  this.trigger(this.data);
}

Reflux.StoreMethods.onForceTrigger = function (data) {
  this.trigger(this.data);
}

Reflux.StoreMethods.onSetSingleton = function (customSingularResourceName) {
  this.singleton = true;
  this.resourceName = customSingularResourceName || this.resourceName.replace(/s$/, "");
};

Reflux.StoreMethods.onRemoveByIds = function (args, trigger) {
  if (typeof trigger === "undefined") {
    trigger = true;
  }

  var ids = [].concat(args);
  var deleted = [];

  this.data = this.data.filter(function (entry) {
    if (ids.indexOf(entry.id) < 0) {
      return true;
    }
    deleted.push(entry);
    return false;
  });

  if (typeof this.cleanup === "function") {
    this.cleanup(deleted);
  }

  if (trigger) {
    this.trigger(this.data);
  }
}

Reflux.StoreMethods.onResetSearch = function (identifier) {
  this.filterIds[identifier] = null;
  this["lastSearchTerm-" + identifier] = null;
  this.emitFilteredData();
}

Reflux.StoreMethods.onSearch = function (identifier, term, searchOn) {
  this.filterIds = this.filterIds || {};

  var searchIds = null;
  var searchFields = [].concat(searchOn);
  var terms = term.toLowerCase().split(/\s+/);
  var lastSearchAttribute = "lastSearchTerm-" + identifier;
  var lastSearchTerm = this[lastSearchAttribute];

  if (lastSearchTerm && term.indexOf(lastSearchTerm) === 0) {
    searchIds = this.filterIds[identifier];
  } else {
    this.filterIds[identifier] = null;
  }

  var searchFieldsMatch = function (entry, value) {
    return searchFields.reduce(function (prev, curr) {
      return prev || (traverse(entry, curr) || "").toLowerCase().indexOf(value) >= 0;
    }, false);
  }

  var filterIds = this.data.reduce(function (idList, entry) {
    if (!searchIds || searchIds.indexOf(entry.id) >= 0) {
      var matches = terms.reduce(function (prev, curr) {
        return prev && searchFieldsMatch(entry, curr);
      }, true);

      if (matches) {
        idList.push(entry.id);
      }
    }

    return idList;
  }, []);

  this.filterIds[identifier] = filterIds;
  this[lastSearchAttribute] = term;
  this.emitFilteredData();
}

Reflux.StoreMethods.onDateFilter = function (searchFrom, searchTo, startFromDate, startToDate, finishFromDate, finishToDate) {
  var identifier = searchFrom + "-" + searchTo;

  if (startFromDate === null && startToDate === null && finishFromDate === null && finishToDate === null) {
    this.filterIds[identifier] = null;
  } else {
    this.filterIds[identifier] = this.data.reduce(function (ids, datum) {
      var fromDates = datum[searchFrom];
      var toDates = datum[searchTo];

      if (
          (startFromDate  === null || dateGreaterThan(fromDates, startFromDate))   &&
          (startToDate    === null || dateLessThan(toDates, startToDate))      &&
          (finishFromDate === null || dateLessThan(fromDates, finishFromDate))  &&
          (finishToDate   === null || dateLessThan(toDates, finishToDate))
         ) ids.push(datum.id);

      return ids;
    }, []);
  }

  this.emitFilteredData();
}

Reflux.StoreMethods.onFilterByIds = function (ids, findBy) {
  var attribute = findBy || "id";

  if (!ids || ids.length === 0) {
    this.trigger(null);
  } else {
    this.trigger(
      this.data.filter(function (entry) {
        return ids.indexOf(traverse(entry, attribute).toString()) >= 0;
      })
    );
  }
}

Reflux.StoreMethods.emitFilteredData = function () {
  var ids = null;
  var isFiltered = false;

  for (var i in this.filterIds) {
    if (this.filterIds.hasOwnProperty(i) && this.filterIds[i] !== null) {
      ids = (ids === null) ? this.filterIds[i] : ids.intersection(this.filterIds[i]);
      isFiltered = true;
    }
  }

  if (!isFiltered) {
    ids = this.data.mapAttribute("id");
  }

  this.trigger(
    this.data.filter(function (entry) {
      return ids.indexOf(entry.id) >= 0;
    })
  );
}

/* Convenience methods */
Reflux.StoreMethods.findById = function (id, attrName) {
  try {
    return this.data.findById(id, attrName);
  } catch (e) {
    console.log(e.stack)
  }
}

Reflux.StoreMethods.map = function (func) {
  return this.data.map(func);
}

Reflux.StoreMethods.mapAttribute = function (func) {
  return this.data.mapAttribute(func);
}

var newJobOffer = Reflux.createAction("newJobOffer");
var OfferedParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
      ["reject"]
    )),
    InMatchingParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
      ["offer"]
    )),
    JobOfferActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
      ["send"]
    )),
    ParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(
      ["setParticipants"]
    )),
    EmployerActions = Reflux.createActions(genericStoreActions.concat(
      ["setStaff"]
    )),
    ParticipantGroupNameActions = Reflux.createActions(genericStoreActions.concat(
      ["setNames"]
    )),
    CountryActions = Reflux.createActions(genericStoreActions.concat(
      ["setCountries"]
    )),
    EnrollmentActions = Reflux.createActions(genericStoreActions.concat(
      ["updateOnReviewCount"]
    )),
    ParticipantActions = Reflux.createActions(genericStoreActions),
    StaffActions = Reflux.createActions(genericStoreActions),
    DraftJobOfferActions = Reflux.createActions(genericStoreActions),
    JobOfferParticipantAgreementActions = Reflux.createActions(genericStoreActions),
    OfferSentActions = Reflux.createActions(genericStoreActions),
    EnglishLevelActions = Reflux.createActions(genericStoreActions),
    AgeAtArrivalActions = Reflux.createActions(genericStoreActions),
    GenderActions = Reflux.createActions(genericStoreActions),
    ParticipantSignedActions = Reflux.createActions(genericStoreActions),
    ProgramActions = Reflux.createActions(genericStoreActions),
    PositionActions = Reflux.createActions(genericStoreActions),
    NotInFileMakerActions = Reflux.createActions(genericStoreActions),
    JobOfferSignedActions = Reflux.createActions(genericStoreActions),
    JobOfferFileMakerReferenceActions = Reflux.createActions(genericStoreActions),
    PreviousParticipationActions = Reflux.createActions(genericStoreActions),
    DriversLicenseActions = Reflux.createActions(genericStoreActions);
