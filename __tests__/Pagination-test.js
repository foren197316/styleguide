'use strict';

jest.dontMock('../src/js/components/Pagination');

describe('Pagination', function () {
  require('../src/js/main');
  var React = require('../node_modules/react/addons');
  var TestUtils = React.addons.TestUtils;

  var Pagination = require('../src/js/components/Pagination');

  var actions = {
    ajaxSearch: jest.genMockFn()
  };

  var pageCount;
  var page;
  var recordCount;

  var pagination;
  var buttons;
  var initPagination = function () {
    pagination = TestUtils.renderIntoDocument(
      Pagination({
        pageCount: pageCount,
        page: page,
        recordCount: recordCount,
        actions: actions
      })
    );
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(pagination, 'a');
  };

  var isActive = function (element) {
    return /\bactive\b/.test(element.getDOMNode().parentNode.className);
  };

  var isDisabled = function (element) {
    return /\bdisabled\b/.test(element.getDOMNode().parentNode.className);
  };

  describe('20 pages, in the middle', function () {
    beforeEach(function () {
      pageCount = 20;
      page = 10;
      recordCount = 50;
      initPagination();
    });

    it('outputs 9 buttons', function () {
      expect(buttons.length).toBe(9);
    });

    it('outputs two ellipsis buttons', function () {
      expect(buttons[2].getDOMNode().innerHTML).toEqual('...');
      expect(isDisabled(buttons[2])).toBeTruthy();
      expect(buttons[6].getDOMNode().innerHTML).toEqual('...');
      expect(isDisabled(buttons[6])).toBeTruthy();
    });

    it('outputs an active button for current page', function () {
      expect(buttons[4].getDOMNode().innerHTML).toEqual('10');
      expect(isActive(buttons[4])).toBeTruthy();
    });

    it('outputs buttons for the first two pages', function () {
      expect(buttons[0].getDOMNode().innerHTML).toEqual('1');
      expect(isActive(buttons[0])).toBeFalsy();

      expect(buttons[1].getDOMNode().innerHTML).toEqual('2');
      expect(isActive(buttons[1])).toBeFalsy();
    });

    it('outputs buttons for the last two pages', function () {
      expect(buttons[7].getDOMNode().innerHTML).toEqual('19');
      expect(isActive(buttons[7])).toBeFalsy();

      expect(buttons[8].getDOMNode().innerHTML).toEqual('20');
      expect(isActive(buttons[8])).toBeFalsy();
    });

    it('outputs buttons for the two surrounding pages', function () {
      expect(buttons[3].getDOMNode().innerHTML).toEqual('9');
      expect(isActive(buttons[3])).toBeFalsy();

      expect(buttons[5].getDOMNode().innerHTML).toEqual('11');
      expect(isActive(buttons[5])).toBeFalsy();
    });

    it('sets the url hash to include page number', function () {
      TestUtils.Simulate.click(buttons[1]);
      expect(actions.ajaxSearch).toBeCalledWith('page=2', function(){});
    });
  });

  describe('20 pages, on the first', function () {
    beforeEach(function () {
      pageCount = 20;
      page = 1;
      recordCount = 50;
      initPagination();
    });

    it('outputs 9 buttons', function () {
      expect(buttons.length).toBe(9);
    });

    it('outputs one ellipsis button', function () {
      expect(buttons[6].getDOMNode().innerHTML).toEqual('...');
      expect(isDisabled(buttons[6])).toBeTruthy();
    });

    it('outputs an active button for current page', function () {
      expect(buttons[0].getDOMNode().innerHTML).toEqual('1');
      expect(isActive(buttons[0])).toBeTruthy();
    });

    it('outputs buttons for the first six pages', function () {
      expect(buttons[1].getDOMNode().innerHTML).toEqual('2');
      expect(isActive(buttons[1])).toBeFalsy();

      expect(buttons[2].getDOMNode().innerHTML).toEqual('3');
      expect(isActive(buttons[2])).toBeFalsy();

      expect(buttons[3].getDOMNode().innerHTML).toEqual('4');
      expect(isActive(buttons[3])).toBeFalsy();

      expect(buttons[4].getDOMNode().innerHTML).toEqual('5');
      expect(isActive(buttons[4])).toBeFalsy();

      expect(buttons[5].getDOMNode().innerHTML).toEqual('6');
      expect(isActive(buttons[5])).toBeFalsy();
    });

    it('outputs buttons for the last two pages', function () {
      expect(buttons[7].getDOMNode().innerHTML).toEqual('19');
      expect(isActive(buttons[7])).toBeFalsy();

      expect(buttons[8].getDOMNode().innerHTML).toEqual('20');
      expect(isActive(buttons[8])).toBeFalsy();
    });

    it('sets the url hash to include page number', function () {
      TestUtils.Simulate.click(buttons[1]);
      expect(actions.ajaxSearch).toBeCalledWith('page=2', function(){});
    });
  });

  describe('20 pages, on the last', function () {
    beforeEach(function () {
      pageCount = 20;
      page = 20;
      recordCount = 50;
      initPagination();
    });

    it('outputs 9 buttons', function () {
      expect(buttons.length).toBe(9);
    });

    it('outputs one ellipsis button', function () {
      expect(buttons[2].getDOMNode().innerHTML).toEqual('...');
      expect(isDisabled(buttons[2])).toBeTruthy();
    });

    it('outputs an active button for current page', function () {
      expect(buttons[8].getDOMNode().innerHTML).toEqual('20');
      expect(isActive(buttons[8])).toBeTruthy();
    });

    it('outputs buttons for the last six pages', function () {
      expect(buttons[3].getDOMNode().innerHTML).toEqual('15');
      expect(isActive(buttons[3])).toBeFalsy();

      expect(buttons[4].getDOMNode().innerHTML).toEqual('16');
      expect(isActive(buttons[4])).toBeFalsy();

      expect(buttons[5].getDOMNode().innerHTML).toEqual('17');
      expect(isActive(buttons[5])).toBeFalsy();

      expect(buttons[6].getDOMNode().innerHTML).toEqual('18');
      expect(isActive(buttons[6])).toBeFalsy();

      expect(buttons[7].getDOMNode().innerHTML).toEqual('19');
      expect(isActive(buttons[7])).toBeFalsy();
    });

    it('outputs buttons for the first two pages', function () {
      expect(buttons[0].getDOMNode().innerHTML).toEqual('1');
      expect(isActive(buttons[0])).toBeFalsy();

      expect(buttons[1].getDOMNode().innerHTML).toEqual('2');
      expect(isActive(buttons[1])).toBeFalsy();
    });

    it('sets the url hash to include page number', function () {
      TestUtils.Simulate.click(buttons[1]);
      expect(actions.ajaxSearch).toBeCalledWith('page=2', function(){});
    });
  });
});
