'use strict';

jest.dontMock('../src/js/components/AjaxSearchFilter');

/*
 * These are needed to fix some mocking problem with vinyl-source-stream
 */
jest.dontMock('events');
jest.dontMock('http');
jest.dontMock('https');

describe('AjaxSearchFilter', function () {
  it('populates its input from the url', function () {
    require('../src/js/main');

    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var AjaxSearchFilter = require('../src/js/components/AjaxSearchFilter');
    var Base64 = require('../src/js/base64');

    var title = "SearchTitle";
    var searchOn = [ 'name', 'uuid' ];

    global.location = {
      hash: '#' + Base64.urlsafeEncode64('q[lolol]=lol&q[name_or_uuid_matches]=Draco')
    };

    var ajaxSearchFilter = TestUtils.renderIntoDocument(
      AjaxSearchFilter({
        title: title,
        searchOn: searchOn
      })
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ajaxSearchFilter, 'input');

    expect(input.getDOMNode().value).toEqual('Draco');
  });
});