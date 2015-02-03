/* @flow */
'use strict';

var React = require('react/addons');
var $ = require('jquery');

module.exports = React.createClass({displayName: 'AjaxSearchForm',
  propTypes: {
    url: React.PropTypes.string.isRequired
  },

  onClick: function () {
    var data = [];

    for (var i in this.refs) {
      if (this.refs.hasOwnProperty(i)) {
        var ref = this.refs[i];
        data.push('q[' + ref.query() + ']=' + ref.value());
      }
    }

    data = data.join('&');

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
        React.Children.map(this.props.children, function (child, index) {
          return React.addons.cloneWithProps(child, { ref: 'child' + index });
        }),
        React.DOM.input({type: 'button', value: 'Search', onClick: this.onClick}, null)
      )
    );
  }
});
