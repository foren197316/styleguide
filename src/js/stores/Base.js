var genericStoreActions    = ["setData", "ajaxLoad"];
var filterableStoreActions = ["search", "resetSearch"];

var defaultStoreError = function () {
  window.location = window.location;
}

Reflux.StoreMethods.onAjaxLoad = function (ids) {
  var data = ids instanceof Array ? { ids: ids.notEmpty().uniq().sort() } : null;

  $.ajax({
    url: window.RESOURCE_URLS[this.resourceName],
    type: "GET",
    data: data,
    success: this.onLoadSuccess.bind(this),
    error: this.onLoadError.bind(this)
  });
}

Reflux.StoreMethods.onLoadSuccess = function (response) {
  this.data = response[this.resourceName.camelCaseToUnderscore()];
  this.permission = true;

  if (typeof this.initPostAjaxLoad === "function") {
    this.initPostAjaxLoad();
  }
}

Reflux.StoreMethods.onLoadError = function (jqXHR, textStatus, errorThrown) {
  this.data = [];
  this.permission = false;
}

Reflux.StoreMethods.onSetData = function (data) {
  this.data = data;
  this.trigger(this.data);
}

Reflux.StoreMethods.findById = function (id, attrName) {
  return this.data.findById(id, attrName);
}

Reflux.StoreMethods.map = function (func) {
  return this.data.map(func);
}

Reflux.StoreMethods.filter = function (func) {
  return this.data.filter(func);
}

Reflux.StoreMethods.mapAttribute = function (func) {
  return this.data.mapAttribute(func);
}

Reflux.StoreMethods.onResetSearch = function (identifier) {
  this.filterIds[indentifier] = null;
  this["lastSearchTerm-" + indentifier] = null;
  this.filter();
}

Reflux.StoreMethods.onSearch = function (indentifier, term, searchOn) {
  this.filterIds = this.filterIds || {};

  var searchIds = null;
  var searchFields = [].concat(searchOn);
  var terms = term.toLowerCase().split(/\s+/);
  var lastSearchAttribute = "lastSearchTerm-" + indentifier;
  var lastSearchTerm = this[lastSearchAttribute];

  if (lastSearchTerm && term.indexOf(lastSearchTerm) === 0) {
    searchIds = this.filterIds[identifier];
  } else {
    this.filterIds[identifier] = null;
  }

  var searchFieldsMatch = function (entry, value) {
    return searchFields.reduce(function (prev, curr) {
      return prev || (entry[curr] || "").toLowerCase().indexOf(value) >= 0;
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
  this.filter();
}

Reflux.StoreMethods.filter = function () {
  var ids = null;
  var isFiltered = false;

  for (var i in this.filterIds) {
    if (this.filterIds.hasOwnProperty(i) && this.filterIds[i] !== null) {
      ids = (ids === null) ? this.filterIds[i] : ids.intersection(this.filterIds[i]);
      isFiltered = true;
    }
  }

  if (!isFiltered) ids = this.data.mapAttribute("id");

  this.trigger(
    this.data.filter(function (entry) {
      return ids.indexOf(entry.id) >= 0;
    })
  );
}

var OfferedParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
      ["reject"]
    )),
    JobOfferActions = Reflux.createActions(genericStoreActions.concat(
      ["send"]
    )),
    ParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(
      ["setParticipants"]
    )),
    EmployerActions = Reflux.createActions(genericStoreActions.concat(
      ["setStaff"]
    )),
    ParticipantActions = Reflux.createActions(genericStoreActions.concat(
      ["setPrograms"]
    )),
    StaffActions = Reflux.createActions(genericStoreActions),
    DraftJobOfferActions = Reflux.createActions(genericStoreActions),
    JobOfferParticipantAgreementActions = Reflux.createActions(genericStoreActions),
    OfferSentActions = Reflux.createActions(genericStoreActions),
    ParticipantSignedActions = Reflux.createActions(genericStoreActions),
    ProgramActions = Reflux.createActions(genericStoreActions),
    PositionActions = Reflux.createActions(genericStoreActions),
    JobOfferFileMakerReferenceActions = Reflux.createActions(genericStoreActions);
