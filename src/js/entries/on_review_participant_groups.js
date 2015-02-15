/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var OnReviewParticipantGroupPanels = require('../components/OnReviewParticipantGroupPanels');

$('document').ready(function () {
  var OnReviewParticipantGroupsNode = document.getElementById('OnReviewParticipantGroups');
  React.render(
    OnReviewParticipantGroupPanels({
      employerId: OnReviewParticipantGroupsNode.getAttribute('employerId'),
      employerName: OnReviewParticipantGroupsNode.getAttribute('employerName'),
      source: OnReviewParticipantGroupsNode.getAttribute('source')
    }),
    OnReviewParticipantGroupsNode
  );
});
