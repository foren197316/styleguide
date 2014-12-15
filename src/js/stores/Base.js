var genericStoreActions = ["setData", "ajaxLoad"];

var defaultStoreError = function () {
  window.location = window.location;
}

Reflux.StoreMethods.onAjaxLoad = function (ids) {
  console.log("Loading " + this.resourceName);
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
  console.log("setting data for " + this.resourceName);
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

var OfferedParticipantGroupActions = Reflux.createActions(genericStoreActions.concat(
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
    PositionActions = Reflux.createActions(genericStoreActions);
