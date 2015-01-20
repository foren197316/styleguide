'use strict';

jest.dontMock('../src/js/stores/JobOfferParticipantAgreementStore.js');
jest.dontMock('../src/js/components/SearchFilter.js');

describe('JobOfferParticipantAgreementStore', function () {
  it('filters JobOfferParticipantAgreements', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var SearchFilter = require('../src/js/components/SearchFilter');
    var JobOfferParticipantAgreementStore = require('../src/js/stores/JobOfferParticipantAgreementStore');
    var actions = require('../src/js/actions');

    JobOfferParticipantAgreementStore.data = [
      { job_offer: { participant: { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' } } },
      { job_offer: { participant: { name: 'Brenda', email: 'ilikedogs@example.com', uuid: 'UU-908' } } },
      { job_offer: { participant: { name: 'Cyrus', email: 'ilikecake@cake.com', uuid: 'UU-768' } } }
    ];

    var title = 'Search';
    var searchOn = [
      ['job_offer', 'participant', 'name'],
      ['job_offer', 'participant', 'email'],
      ['job_offer', 'participant', 'uuid']
    ];

    var searchFilter = TestUtils.renderIntoDocument(
      SearchFilter({
        title: title,
        searchOn: searchOn,
        actions: actions.JobOfferParticipantAgreementActions
      })
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(searchFilter, 'input');
  });
});
