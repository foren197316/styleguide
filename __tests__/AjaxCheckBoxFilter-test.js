'use strict';

jest.dontMock('../src/js/components/AjaxCheckBoxFilter');
jest.dontMock('../src/js/stores/ParticipantGroupNameStore');

describe('AjaxCheckBoxFilter', function () {
  it('populates its input from the url', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;

    var AjaxCheckBoxFilter = require('../src/js/components/AjaxCheckBoxFilter');
    var ParticipantGroupNameStore = require('../src/js/stores/ParticipantGroupNameStore');
    var Base64 = require('../src/js/base64');

    var title = 'Group Name';
    var fieldName = 'participant_group_name';
    var store = ParticipantGroupNameStore;

    store.permission = true;
    store.data = [
      { id: 'Friends', name: 'Friends' },
      { id: 'Individual', name: 'Individual' },
      { id: 'lol', name: 'lol' }
    ];

    global.location = {
      hash: '#' + Base64.urlsafeEncode64('q[lolol]=lol&q[participant_group_name_eq_any][]=Friends&q[participant_group_name_eq_any][]=Individual')
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
