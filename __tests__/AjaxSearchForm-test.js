'use strict';

jest.dontMock('../src/js/components/AjaxSearchForm');
jest.dontMock('../src/js/base64');

describe('AjaxSearchForm', function () {
  it('submits', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var AjaxSearchForm = require('../src/js/components/AjaxSearchForm');
    var $ = require('../node_modules/jquery');
    var Base64 = require('../src/js/base64');

    $.ajax = jest.genMockFn().mockImpl(function (ajaxOptions) {
      ajaxOptions.success();
    });

    global.history = {
      pushState: jest.genMockFn()
    };

    var basePath = '/index';
    var currentPath = basePath + ':lolololol';
    global.location = {
      pathname: currentPath
    };

    var query = 'participant_application_uuid_or_participant_application_email_or_participant_application_name_matches';
    var value = 'Draco';
    var child = React.createClass({displayName: 'ChildMan',
      query: jest.genMockFn().mockReturnValue(query),
      value: jest.genMockFn().mockReturnValue(value),
      render: function(){return React.DOM.div(null);}
    });

    var ajaxSearchForm = TestUtils.renderIntoDocument(
      AjaxSearchForm(null,
        child(null)
      )
    );

    var submit = TestUtils.findRenderedDOMComponentWithTag(ajaxSearchForm, 'input');

    TestUtils.Simulate.click(submit);

    var expectedData = 'q[' + query + ']=' + value;
    var expectedPath = basePath + ':' + Base64.urlsafeEncode64(expectedData);

    expect($.ajax).toBeCalled();
    expect(global.history.pushState).toBeCalledWith(expectedData, '', expectedPath);
  });
});
