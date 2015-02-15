/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var JobOfferParticipantAgreementsIndex = require('../components/JobOfferParticipantAgreementsIndex');

$('document').ready(function () {
  var JobOfferParticipantAgreementsNode = document.getElementById('JobOfferParticipantAgreements');
  React.render(
    JobOfferParticipantAgreementsIndex({
      urls: {
        jobOfferParticipantAgreements: JobOfferParticipantAgreementsNode.getAttribute('jobOfferParticipantAgreements'),
        programs: JobOfferParticipantAgreementsNode.getAttribute('programs'),
        positions: JobOfferParticipantAgreementsNode.getAttribute('positions'),
        employers: JobOfferParticipantAgreementsNode.getAttribute('employers'),
        staffs: JobOfferParticipantAgreementsNode.getAttribute('staffs'),
        export: JobOfferParticipantAgreementsNode.getAttribute('export')
      }
    }),
    JobOfferParticipantAgreementsNode
  );
});
