'use strict';

jest.dontMock('../src/js/components/AjaxSearchForm');

describe('AjaxSearchForm', function () {
  it('submits', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var AjaxSearchForm = require('../src/js/components/AjaxSearchForm');
    var $ = require('../node_modules/jquery');

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

    btoa = jest.genMockFn().mockImpl(function (string) {
      return new Buffer(string).toString('base64');
    });

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
    var expectedPath = basePath + ':' + btoa(expectedData);

    expect($.ajax).toBeCalled();
    expect(global.history.pushState).toBeCalledWith(expectedData, '', expectedPath);
  });
});
