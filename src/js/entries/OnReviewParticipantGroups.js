/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var OnReviewParticipantGroupPanels = require('../components/OnReviewParticipantGroupPanels');

$('document').ready(function () {
  var OnReviewParticipantGroupsNode = document.getElementById('RootNode');
  React.render(
    OnReviewParticipantGroupPanels({
      employerId: OnReviewParticipantGroupsNode.dataset.employer_id,
      employerName: OnReviewParticipantGroupsNode.dataset.employer_name,
      source: OnReviewParticipantGroupsNode.dataset.source
    }),
    OnReviewParticipantGroupsNode
  );
});
