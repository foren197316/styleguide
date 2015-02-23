/* @flow */
'use strict';

require('../main');
var React = require('react/addons');
var withRootNode = require('../root-node');
var JobOfferParticipantAgreementsIndex = require('../components/JobOfferParticipantAgreementsIndex');

withRootNode(function (rootNode) {
  React.render(JobOfferParticipantAgreementsIndex({
    urls: {
      jobOfferParticipantAgreements: rootNode.dataset.job_offer_participant_agreements,
      programs: rootNode.dataset.programs,
      positions: rootNode.dataset.positions,
      employers: rootNode.dataset.employers,
      staffs: rootNode.dataset.staffs,
      export: rootNode.dataset.export
    }
  }), rootNode);
});
