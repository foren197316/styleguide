'use strict';

jest.autoMockOff();
var Reflux = require('../node_modules/reflux/index');
// jest.dontMock('../src/js/stores/JobOfferParticipantAgreementStore.js');
// jest.dontMock('../src/js/components/JobOfferParticipantAgreementsIndex.js');
// jest.dontMock('../src/js/components/SearchFilter.js');

describe('JobOfferParticipantAgreementStore', function () {
  it('filters JobOfferParticipantAgreements', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var JobOfferParticipantAgreementStore = require('../src/js/stores/JobOfferParticipantAgreementStore');
    var JobOfferParticipantAgreementsIndex = require('../src/js/components/JobOfferParticipantAgreementsIndex');
    var SearchFilter = require('../src/js/components/SearchFilter');
    var actions = require('../src/js/actions');

    var title = 'Search';

    // JobOfferParticipantAgreementStore.data = [
      // { job_offer: { participant: { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' } } },
      // { job_offer: { participant: { name: 'Brenda', email: 'ilikedogs@example.com', uuid: 'UU-908' } } },
      // { job_offer: { participant: { name: 'Cyrus', email: 'ilikecake@cake.com', uuid: 'UU-768' } } }
    // ];

    JobOfferParticipantAgreementStore.data = [
      { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' },
      { name: 'Brenda', email: 'ilikedogs@example.com', uuid: 'UU-908' },
      { name: 'Cyrus', email: 'ilikecake@cake.com', uuid: 'UU-768' }
    ];

    var searchOn = 'name';

    var searchFilter = TestUtils.renderIntoDocument(
      SearchFilter({
        title: title,
        searchOn: searchOn,
        actions: actions.JobOfferParticipantAgreementActions
      })
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(searchFilter, 'input');

    TestUtils.Simulate.change(input, {target: {value: 'Ralp'}});

    expect(JobOfferParticipantAgreementStore.data.length).toEqual(1);
  });
});
