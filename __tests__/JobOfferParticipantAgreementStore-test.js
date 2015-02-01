'use strict';

jest.autoMockOff();

describe('JobOfferParticipantAgreementStore', function () {
  beforeEach(function () {
    require('../src/js/main');
    TestUtils = require('../node_modules/react/addons').addons.TestUtils;
    JobOfferParticipantAgreementStore = require('../src/js/stores/JobOfferParticipantAgreementStore');
    JobOfferParticipantAgreementStore.trigger = jest.genMockFn();
  });

  it('filters JobOfferParticipantAgreements not in filemaker', function () {
    var title = 'FileMaker';
    var label = 'Not in FileMaker';
    var BooleanFilter = require('../src/js/components/BooleanFilter');
    var action = JobOfferParticipantAgreementStore.toggleNotInFileMaker;
    JobOfferParticipantAgreementStore.toggleNotInFileMaker = jest.genMockFn().mockImpl(action);

    JobOfferParticipantAgreementStore.data = [
      { job_offer: { participant: { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' }, file_maker_reference: false } },
      { job_offer: { participant: { name: 'Brenda', email: 'ilikedogs@example.com', uuid: 'UU-908' }, file_maker_reference: true } },
      { job_offer: { participant: { name: 'Cyrus', email: 'ilikecake@cake.com', uuid: 'UU-768' }, file_maker_reference: false } }
    ];

    var booleanFilter = TestUtils.renderIntoDocument(
      BooleanFilter({
        title: title,
        label: label,
        action: JobOfferParticipantAgreementStore.toggleNotInFileMaker
      })
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(booleanFilter, 'input');

    TestUtils.Simulate.change(input);

    setTimeout(function () {
      expect(JobOfferParticipantAgreementStore.toggleNotInFileMaker).toBeCalledWith(true);
      expect(JobOfferParticipantAgreementStore.trigger).toBeCalledWith([
        { job_offer: { participant: { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' }, file_maker_reference: false } },
        { job_offer: { participant: { name: 'Cyrus', email: 'ilikecake@cake.com', uuid: 'UU-768' }, file_maker_reference: false } }
      ]);
    }, 200);
  });

  it('filters JobOfferParticipantAgreements by search', function () {
    var SearchFilter = require('../src/js/components/SearchFilter');
    var actions = require('../src/js/actions');
    var onSearchMethod = JobOfferParticipantAgreementStore.onSearch;
    JobOfferParticipantAgreementStore.onSearch = jest.genMockFn().mockImpl(onSearchMethod);

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

    setTimeout(function () {
      expect(JobOfferParticipantAgreementStore.onSearch).toBeCalledWith('Ralp');
      expect(JobOfferParticipantAgreementStore.trigger).toBeCalledWith([
        { job_offer: { participant: { name: 'Ralph', email: 'ilikecats@example.com', uuid: 'UU-123' }, file_maker_reference: false } },
      ]);
    }, 200);
  });
});
