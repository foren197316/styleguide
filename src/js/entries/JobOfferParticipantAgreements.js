/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var JobOfferParticipantAgreementsIndex = require('../components/JobOfferParticipantAgreementsIndex');

$('document').ready(function () {
  var JobOfferParticipantAgreementsNode = document.getElementById('RootNode');
  React.render(
    JobOfferParticipantAgreementsIndex({
      urls: {
        jobOfferParticipantAgreements: JobOfferParticipantAgreementsNode.dataset.job_offer_participant_agreements,
        programs: JobOfferParticipantAgreementsNode.dataset.programs,
        positions: JobOfferParticipantAgreementsNode.dataset.positions,
        employers: JobOfferParticipantAgreementsNode.dataset.employers,
        staffs: JobOfferParticipantAgreementsNode.dataset.staffs,
        export: JobOfferParticipantAgreementsNode.dataset.export
      }
    }),
    JobOfferParticipantAgreementsNode
  );
});
