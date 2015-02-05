'use strict';

jest.dontMock('../src/js/components/AjaxBooleanFilter');

describe('AjaxBooleanFilter', function () {
  it('populates its input from the url', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var AjaxBooleanFilter = require('../src/js/components/AjaxBooleanFilter');
    var Base64 = require('../src/js/base64');

    var title = 'Returning Participant';
    var label = 'Returning Participant';
    var fieldName = 'has_j1_visa';
    var bool = true;

    global.location = {
      hash: '#' + Base64.urlsafeEncode64('q[lolol]=lol&q[has_j1_visa_true]=1')
    };

    var ajaxBooleanFilter = TestUtils.renderIntoDocument(
      AjaxBooleanFilter({
        title: title,
        label: label,
        fieldName: fieldName,
        bool: bool
      })
    );

    var checkbox = TestUtils.findRenderedDOMComponentWithTag(ajaxBooleanFilter, 'input');

    expect(checkbox.getDOMNode().checked).toBe(true);
  });
});
