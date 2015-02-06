'use strict';

jest.dontMock('../src/js/components/AjaxCheckBoxFilter');
jest.dontMock('../src/js/stores/ParticipantGroupNameStore');

describe('AjaxCheckBoxFilter', function () {
  var React = require('../node_modules/react/addons');
  var TestUtils = React.addons.TestUtils;

  var AjaxCheckBoxFilter = require('../src/js/components/AjaxCheckBoxFilter');
  var Base64 = require('../src/js/base64');

  var title = 'Group Name';
  var fieldName = 'participant_group_name';

  it('populates multiple inputs from the url', function () {
    var store = require('../src/js/stores/ParticipantGroupNameStore');
    store.permission = true;
    store.data = [
      { id: 'Friends', name: 'Friends' },
      { id: 3, name: 'Individual' },
      { id: 'lol', name: 'lol' }
    ];

    global.location = {
      hash: '#' + Base64.urlsafeEncode64('q[lolol]=lol&q[participant_group_name_eq_any][]=Friends&q[participant_group_name_eq_any][]=3')
    };

    var ajaxCheckBoxFilter = TestUtils.renderIntoDocument(
      AjaxCheckBoxFilter({
        title: title,
        fieldName: fieldName,
        store: store
      })
    );

    var checkboxes = TestUtils.scryRenderedDOMComponentsWithTag(ajaxCheckBoxFilter, 'input');

    expect(checkboxes[0].getDOMNode().checked).toBe(true);
    expect(checkboxes[1].getDOMNode().checked).toBe(true);
    expect(checkboxes[2].getDOMNode().checked).toBe(false);
  });
});
