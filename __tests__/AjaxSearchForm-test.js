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

    var formSending = {
      requestChange: jest.genMockFn(),
      value: false
    };

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

    var actions = {
      ajaxSearch: jest.genMockFn()
    };

    var ajaxSearchForm = TestUtils.renderIntoDocument(
      AjaxSearchForm({ url: '', actions: actions, formSending: formSending },
        child(null)
      )
    );

    var form = TestUtils.findRenderedDOMComponentWithTag(ajaxSearchForm, 'form');

    TestUtils.Simulate.submit(form);

    var expectedData = query;
    var expectedPath = '#' + Base64.urlsafeEncode64(expectedData);

    expect(actions.ajaxSearch).toBeCalledWith(expectedData, function(){});
  });
});
