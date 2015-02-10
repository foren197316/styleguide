'use strict';

jest.dontMock('../src/js/components/Pagination');

describe('Pagination', function () {
  it('shows a link for each page number', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var pageCount = 5;
    var page = 3;
    var recordCount = 50;
    var Pagination = require('../src/js/components/Pagination');

    var actions = {
      ajaxSearch: jest.genMockFn()
    };

    var formSending = {
      requestChange: jest.genMockFn(),
      value: false
    };

    var pagination = TestUtils.renderIntoDocument(
      Pagination({
        pageCount: pageCount,
        page: page,
        recordCount: recordCount,
        actions: actions,
        formSending: formSending
      })
    );

    var anchors = TestUtils.scryRenderedDOMComponentsWithTag(pagination, 'a');

    expect(anchors.length).toBe(pageCount);

    for (var i=0; i<pageCount; i++) {
      expect(anchors[i].getDOMNode().innerHTML).toBe((i+1).toString());

      if (i+1 === page) {
        expect(anchors[i].getDOMNode().className.indexOf('disabled')).toBeGreaterThan(-1);
      } else {
        expect(anchors[i].getDOMNode().className.indexOf('disabled')).toBe(-1);
      }
    }

    TestUtils.Simulate.click(anchors[1]);

    expect(actions.ajaxSearch).toBeCalledWith('page=2', function(){});
  });
});
