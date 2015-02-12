'use strict';

jest.autoMockOff();

describe('JobOfferParticipantAgreementStore', function () {
  beforeEach(function () {
    require('../src/js/main');
    TestUtils = require('../node_modules/react/addons').addons.TestUtils;

    JobOfferParticipantAgreementStore = require('../src/js/stores/JobOfferParticipantAgreementStore');
    JobOfferParticipantAgreementStore.filterIds = {};
    JobOfferParticipantAgreementStore.data = [
      { id: 1, job_offer: { participant: { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' }, file_maker_reference: false } },
      { id: 2, job_offer: { participant: { name: 'Brenda', email: 'ilikedogs@example.com', uuid: 'UU-908' }, file_maker_reference: true } },
      { id: 3, job_offer: { participant: { name: 'Cyrus', email: 'ilikecake@cake.com', uuid: 'UU-768' }, file_maker_reference: false } }
    ];

    JobOfferParticipantAgreementStore.trigger = jest.genMockFn();
  });

  it('filters JobOfferParticipantAgreements not in filemaker', function () {
    var title = 'FileMaker';
    var label = 'Not in FileMaker';
    var BooleanFilter = require('../src/js/components/BooleanFilter');
    var action = JobOfferParticipantAgreementStore.toggleNotInFileMaker;
    JobOfferParticipantAgreementStore.toggleNotInFileMaker = jest.genMockFn().mockImpl(action);

    var booleanFilter = TestUtils.renderIntoDocument(
      BooleanFilter({
        title: title,
        label: label,
        action: JobOfferParticipantAgreementStore.toggleNotInFileMaker
      })
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(booleanFilter, 'input');

    TestUtils.Simulate.change(input);

    expect(JobOfferParticipantAgreementStore.toggleNotInFileMaker).toBeCalledWith(true);
    expect(JobOfferParticipantAgreementStore.trigger).toBeCalledWith([
      { id: 1, job_offer: { participant: { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' }, file_maker_reference: false } },
      { id: 3, job_offer: { participant: { name: 'Cyrus', email: 'ilikecake@cake.com', uuid: 'UU-768' }, file_maker_reference: false } }
    ]);
  });

  it('filters JobOfferParticipantAgreements by search', function () {
    return;
    var SearchFilter = require('../src/js/components/SearchFilter');
    var actions = require('../src/js/actions');

    var searchOn = [
      ['job_offer', 'participant', 'name'],
      ['job_offer', 'participant', 'email'],
      ['job_offer', 'participant', 'uuid']
    ];

    var searchFilter = TestUtils.renderIntoDocument(
      SearchFilter({
        title: 'Search',
        searchOn: searchOn,
        actions: actions.JobOfferParticipantAgreementActions
      })
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(searchFilter, 'input');

    TestUtils.Simulate.change(input, {target: {value: 'Ralp'}});

    expect(JobOfferParticipantAgreementStore.trigger).toBeCalledWith([
      { id: 1, job_offer: { participant: { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' }, file_maker_reference: false } }
    ]);
  });
});
