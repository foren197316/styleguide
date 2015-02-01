'use strict';

jest.autoMockOff();

describe('SearchFilter', function () {
  it('requests a data change', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var SearchFilter = require('../src/js/components/SearchFilter');

    var title = "Search";
    var value = "Brenda";
    var searchOn = "participant_names";
    var actions = {
      search: jest.genMockFunction(),
      resetSearch: jest.genMockFunction()
    };

    var searchFilter = TestUtils.renderIntoDocument(
      SearchFilter({
        title: title,
        searchOn: searchOn,
        actions: actions
      })
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(searchFilter, 'input');

    TestUtils.Simulate.change(input, {target: {value: value}});

    expect(actions.search).toBeCalledWith(title, value, searchOn);

    TestUtils.Simulate.change(input, {target: {value: ''}});

    expect(actions.resetSearch).toBeCalledWith(title);
  });
});
