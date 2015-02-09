'use strict';

jest.dontMock('../src/js/components/Pagination');

describe('Pagination', function () {
  it('shows a link for each page number', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var pageCount = 5;
    var page = 3;
    var Pagination = require('../src/js/components/Pagination');

    var actions = {
      ajaxSearch: jest.genMockFn()
    };

    var pagination = TestUtils.renderIntoDocument(
      Pagination({ pageCount: pageCount, page: page, actions: actions })
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithTag(pagination, 'button');

    expect(buttons.length).toBe(pageCount);

    for (var i=0; i<pageCount; i++) {
      if (i+1 === page) {
        expect(buttons[i].getDOMNode().disabled).toBeTruthy();
      } else {
        expect(buttons[i].getDOMNode().disabled).toBeFalsy();
      }
      expect(buttons[i].getDOMNode().innerHTML).toBe((i+1).toString());
    }

    TestUtils.Simulate.click(buttons[1]);

    expect(actions.ajaxSearch).toBeCalledWith('page=2');
  });
});
