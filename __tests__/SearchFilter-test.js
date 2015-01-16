jest.dontMock('../src/js/components/SearchFilter.js');

describe('SearchFilter', function () {
  it('requests a data change', function () {
    var React = require('../node_modules/react/addons');
    var SearchFilter = require('../src/js/components/SearchFilter.js');
    var TestUtils = React.addons.TestUtils;
    var actions = {
      search: function(){},
      resetSearch: function(){}
    };

    var searchFilter = TestUtils.renderIntoDocument(
      SearchFilter({
        title: "Search",
        searchOn: "participant_names",
        actions: actions
      })
    );
  });
});
