'use strict';

jest.dontMock('../src/js/components/AjaxDateRangeFilter');
jest.dontMock('jquery');

describe('AjaxDateRangeFilter', function () {
  it('populates its input from the url', function () {
    var React = require('../node_modules/react/addons');
    var TestUtils = React.addons.TestUtils;
    require('../node_modules/jquery-ui'); /* needed for datepicker */

    var AjaxDateRangeFilter = require('../src/js/components/AjaxDateRangeFilter');
    var Base64 = require('../src/js/base64');

    var searchFrom = 'arrival_date';
    var searchTo = 'departure_date';

    var arrivalDate = '10/09/2015';
    var departureDate = '10/24/2016';

    global.location = {
      hash: '#' + Base64.urlsafeEncode64('q[lolol]=lol&q[arrival_date_date_gteq]=' + arrivalDate + '&q[departure_date_date_lteq]=' + departureDate)
    };

    var ajaxDateRangeFilter = TestUtils.renderIntoDocument(
      AjaxDateRangeFilter({ searchFrom: searchFrom, searchTo: searchTo })
    );

    var datepickers = TestUtils.scryRenderedDOMComponentsWithTag(ajaxDateRangeFilter, 'input');

    expect(datepickers[0].getDOMNode().value).toEqual(arrivalDate);
    expect(datepickers[3].getDOMNode().value).toEqual(departureDate);
  });
});
