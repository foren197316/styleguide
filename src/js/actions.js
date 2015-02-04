'use strict';

var Reflux = require('reflux');
var genericStoreActions    = ['setData', 'ajaxLoad', 'filterByIds', 'forceTrigger', 'removeByIds', 'setSingleton', 'ajaxLoadSingleton'];
var filterableStoreActions = ['search', 'resetSearch', 'dateFilter', 'ajaxSearch'];

module.exports = {
  OfferedParticipantGroupActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
    ['reject']
  )),
  InMatchingParticipantGroupActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
    ['offer', 'toggleInternationalDriversLicense', 'togglePreviousParticipation']
  )),
  JobOfferGroupActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
    ['create', 'destroy', 'toggleAllSigned']
  )),
  ParticipantGroupNameActions: Reflux.createActions(genericStoreActions.concat(
    ['setNames']
  )),
  CountryActions: Reflux.createActions(genericStoreActions.concat(
    ['setCountries']
  )),
  StaffActions: Reflux.createActions(genericStoreActions.concat(
    ['loadFromEmployer']
  )),
  ProgramActions: Reflux.createActions(genericStoreActions.concat(
    ['loadFromEmployer']
  )),
  EmployerActions: Reflux.createActions(genericStoreActions.concat(
    ['updateOnReviewCount']
  )),
  JobOfferParticipantAgreementActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions)),
  JobOfferSignedActions: Reflux.createActions(genericStoreActions),
  EnglishLevelActions: Reflux.createActions(genericStoreActions),
  AgeAtArrivalActions: Reflux.createActions(genericStoreActions),
  GenderActions: Reflux.createActions(genericStoreActions),
  PositionActions: Reflux.createActions(genericStoreActions),
  loadFromJobOfferGroups: Reflux.createAction('loadFromJobOfferGroups'),
  loadFromOfferedParticipantGroups: Reflux.createAction('loadFromOfferedParticipantGroups'),
  loadFromJobOfferParticipantAgreements: Reflux.createAction('loadFromJobOfferParticipantAgreements'),
  loadFromInMatchingParticipantGroups: Reflux.createAction('loadFromInMatchingParticipantGroups'),
  setUrls: Reflux.createAction('setUrls')
};
