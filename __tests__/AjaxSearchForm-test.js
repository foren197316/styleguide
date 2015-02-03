'use strict';

jest.dontMock('../src/js/components/AjaxSearchForm');

describe('AjaxSearchForm', function () {
  it('submits', function () {
    var TestUtils = require('../node_modules/react/addons').addons.TestUtils;

    var AjaxSearchForm = require('../src/js/components/AjaxSearchForm');
    var $ = require('../node_modules/jquery');
    var mockSearch = TestUtils.mockComponent(require('../src/js/components/SearchFilter'));

    $.ajax = jest.genMockFn().mockImpl(function (ajaxOptions) {
      ajaxOptions.success();
    });

    global.history = {
      pushState: jest.genMockFn()
    };

    btoa = jest.genMockFn().mockImpl(function (string) {
      return new Buffer(string).toString('base64');
    });

    var ajaxSearchForm = TestUtils.renderIntoDocument(
      AjaxSearchForm({},
        mockSearch
      )
    );

    var submit = TestUtils.findRenderedDOMComponentWithTag(ajaxSearchForm, 'input');

    TestUtils.Simulate.click(submit);

    expect($.ajax).toBeCalled();
    expect(global.history.pushState).toBeCalled();
  });
});
