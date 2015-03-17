/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var rootNode = require('../root-node');
var JobOfferParticipantAgreementsIndex = require('../components/JobOfferParticipantAgreementsIndex');

React.render(React.createElement(JobOfferParticipantAgreementsIndex, {
  urls: {
    jobOfferParticipantAgreements: rootNode.dataset.job_offer_participant_agreements,
    programs: rootNode.dataset.programs,
    positions: rootNode.dataset.positions,
    employers: rootNode.dataset.employers,
    staffs: rootNode.dataset.staffs,
    export: rootNode.dataset.export
  }
}), rootNode);
