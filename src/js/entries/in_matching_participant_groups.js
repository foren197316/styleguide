/* @flow */
'use strict';

require('../main');
var $ = require('jquery');
var React = require('react/addons');
var InMatchingParticipantGroupsIndex = require('../components/InMatchingParticipantGroupsIndex');

$('document').ready(function () {
  var InMatchingParticipantGroupsNode = document.getElementById('InMatchingParticipantGroups');
  React.render(
    InMatchingParticipantGroupsIndex({
      urls: {
        employer: InMatchingParticipantGroupsNode.getAttribute('employer'),
        inMatchingParticipantGroups: InMatchingParticipantGroupsNode.getAttribute('inMatchingParticipantGroups'),
        programs: InMatchingParticipantGroupsNode.getAttribute('programs'),
        positions: InMatchingParticipantGroupsNode.getAttribute('positions'),
        countries: InMatchingParticipantGroupsNode.getAttribute('countries')
      }
    }),
    InMatchingParticipantGroupsNode
  );
});
