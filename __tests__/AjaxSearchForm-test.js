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

    global.location = {
      hash: '#lolololol'
    };

    var query = 'q[participant_application_uuid_or_participant_application_email_or_participant_application_name_matches]=Draco';
    var child = React.createClass({displayName: 'ChildMan',
      query: jest.genMockFn().mockReturnValue(query),
      render: function(){return React.DOM.div(null);}
    });

    var ajaxSearchForm = TestUtils.renderIntoDocument(
      AjaxSearchForm({ url: '', reloadAction: jest.genMockFn() },
        child(null)
      )
    );

    var submit = TestUtils.findRenderedDOMComponentWithTag(ajaxSearchForm, 'button');

    TestUtils.Simulate.click(submit);

    var expectedData = query;
    var expectedPath = '#' + Base64.urlsafeEncode64(expectedData);

    expect($.ajax).toBeCalled();
    expect(global.history.pushState).toBeCalledWith(expectedData, '', expectedPath);
  });
});
