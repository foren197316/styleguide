/* @flow */
'use strict';

let Reflux = require('reflux');
let genericStoreActions    = ['setData', 'ajaxLoad', 'filterByIds', 'forceTrigger', 'removeByIds', 'setSingleton', 'ajaxLoadSingleton'];
let filterableStoreActions = ['search', 'resetSearch', 'dateFilter', 'ajaxSearch'];

module.exports = {
  OfferedParticipantGroupActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
    ['reject']
  )),
  InMatchingParticipantGroupActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions).concat(
    ['offer', 'toggleInternationalDriversLicense', 'togglePreviousParticipation']
  )),
  OnReviewParticipantGroupActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions)),
  JobListingActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions)),
  JobOfferGroupActions: Reflux.createActions(genericStoreActions.concat(filterableStoreActions)),
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
  loadFromJobListings: Reflux.createAction('loadFromJobListings'),
  loadFromOnReviewParticipantGroups: Reflux.createAction('loadFromOnReviewParticipantGroups')
};
