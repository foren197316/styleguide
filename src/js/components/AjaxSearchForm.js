/* @flow */
'use strict';

var React = require('react/addons');
var $ = require('jquery');

var AjaxSearchForm = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired
  },

  onClick: function () {
    var data = {};

    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: data,
      success: function () {
        var path = global.location.pathname.split(':')[0];
        global.history.pushState(data, '', path + ':' + btoa(data));
      }
    });
  },

  render: function () {
    return (
      React.DOM.form({method: '', action: ''},
        this.props.children,
        React.DOM.input({type: 'submit', value: 'Search', onClick: this.onClick}, null)
      )
    );
  }
});

module.exports = AjaxSearchForm;
