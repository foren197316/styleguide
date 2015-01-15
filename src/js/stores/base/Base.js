var RESOURCE_URLS;
var genericStoreActions    = ["setData", "deprecatedAjaxLoad", "ajaxLoad", "filterByIds", "forceTrigger", "removeByIds", "setSingleton", "ajaxLoadSingleton"];
var filterableStoreActions = ["search", "resetSearch", "dateFilter"];

var SetUrlsMixin = {
  propTypes: {
    urls: React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    RESOURCE_URLS = this.props.urls;
  }
}

var parseIntBase10 = function (string) {
  return parseInt(string, 10);
};

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

Reflux.StoreMethods.onAjaxLoad = function () {
  var args = arguments;
  var data = null;

  /* first argument may be an array of ids, the rest are treated as callbacks */
  if (args[0] instanceof Array) {
    data = { ids: args[0].notEmpty().sort().uniq() };
  }

  $.ajax({
    url: RESOURCE_URLS[this.resourceName],
    type: "GET",
    data: data,
    success: function (response) {
      /* replace first argument unless it's a callback */
      if (data !== null) {
        [].shift.call(args);
      }
      [].unshift.call(args, response);
      this.onLoadSuccess.apply(this, args);
    }.bind(this),
    error: this.onLoadError.bind(this)
  });
};

Reflux.StoreMethods.onAjaxLoadSingleton = function () {
  this.onSetSingleton();
  var args = arguments;
  this.onAjaxLoad.apply(this, args);
};

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
  } else {
    this.trigger(this.data);
  }

  if (args.length > 1) {
    for (var i=1; i<args.length; i++) {
      args[i](this.data);
    }
  }
}

/**
 * You can pass arbitrary arguments to `deprecatedAjaxLoad` and they will
 * be passed on to `initPostAjaxLoad` along with the AJAX response.
 *
 * TODO: this is deprecated. we want to move away from passing a context object to passing a generic action callback
 */
Reflux.StoreMethods.onDeprecatedAjaxLoad = function (ids) {
  var data = ids instanceof Array ? { ids: ids.notEmpty().sort().uniq() } : null;
  var args = arguments;

  $.ajax({
    url: window.RESOURCE_URLS[this.resourceName],
    type: "GET",
    data: data,
    success: function (response) {
      [].shift.call(args);
      [].unshift.call(args, response);
      this.onDeprecatedLoadSuccess.apply(this, args);
    }.bind(this),
    error: this.onLoadError.bind(this)
  });
}

Reflux.StoreMethods.onDeprecatedLoadSuccess = function (response) {
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
  this.trigger(this.data);
}

Reflux.StoreMethods.genericIdFilter = function (filterKey, filter_ids, condition) {
  this.filterIds = this.filterIds || {};

  if (filter_ids == undefined || filter_ids.length === 0) {
    this.filterIds[filterKey] = null;
  } else {
    this.filterIds[filterKey] = this.data.reduce(function (ids, entry) {
      if (condition(entry)) {
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
  this.filterIds = this.filterIds || {};

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
          (finishFromDate === null || dateGreaterThan(fromDates, finishFromDate))  &&
          (finishToDate   === null || dateLessThan(toDates, finishToDate))
         ) ids.push(datum.id);

      return ids;
    }, []);
  }

  this.emitFilteredData();
}

Reflux.StoreMethods.onFilterByIds = function (ids) {
  if (!ids || ids.length === 0) {
    this.trigger(this.data);
  } else {
    this.trigger(
      this.data.filter(function (entry) {
        return ids.indexOf(entry.id.toString()) >= 0;
      })
    );
  }
}

Reflux.StoreMethods.emitFilteredData = function () {
  var ids = null;
  var data;

  for (var i in this.filterIds) {
    if (this.filterIds.hasOwnProperty(i) && this.filterIds[i] !== null) {
      ids = (ids === null) ? this.filterIds[i] : ids.intersection(this.filterIds[i]);
    }
  }

  if (ids === null) {
    data = this.data;
  } else {
    data = this.data.filter(function (entry) {
      return ids.indexOf(entry.id) >= 0;
    })
  }

  this.trigger(data);
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

var GlobalActions = Reflux.createActions([
  "newJobOffer",
  "loadFromJobOfferGroups",
  "loadFromOfferedParticipantGroups",
  "loadFromJobOfferParticipantAgreements",
  "loadFromInMatchingParticipantGroups"
]);

var OfferedParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
      ["reject"]
    )),
    InMatchingParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
      ["offer", "toggleInternationalDriversLicense", "togglePreviousParticipation"]
    )),
    JobOfferActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
      ["send", "toggleJobOfferSigned", "toggleNotInFileMaker"]
    )),
    JobOfferGroupActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
      ["create", "destroy", "toggleAllSigned"]
    )),
    ParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(
      ["setParticipants"]
    )),
    ParticipantGroupNameActions = Reflux.createActions(genericStoreActions.concat(
      ["setNames"]
    )),
    CountryActions = Reflux.createActions(genericStoreActions.concat(
      ["setCountries"]
    )),
    StaffActions = Reflux.createActions(genericStoreActions.concat(
      ["loadFromEmployer"]
    )),
    ProgramActions = Reflux.createActions(genericStoreActions.concat(
      ["loadFromEmployer"]
    )),
    EmployerActions = Reflux.createActions(genericStoreActions.concat(
      ["updateOnReviewCount"]
    )),
    ParticipantActions = Reflux.createActions(genericStoreActions),
    DraftJobOfferActions = Reflux.createActions(genericStoreActions),
    JobOfferParticipantAgreementActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions)),
    JobOfferSignedActions = Reflux.createActions(genericStoreActions),
    OfferSentActions = Reflux.createActions(genericStoreActions),
    EnglishLevelActions = Reflux.createActions(genericStoreActions),
    AgeAtArrivalActions = Reflux.createActions(genericStoreActions),
    GenderActions = Reflux.createActions(genericStoreActions),
    ParticipantSignedActions = Reflux.createActions(genericStoreActions),
    PositionActions = Reflux.createActions(genericStoreActions),
    JobOfferFileMakerReferenceActions = Reflux.createActions(genericStoreActions);
