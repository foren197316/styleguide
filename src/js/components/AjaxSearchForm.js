/* @flow */
'use strict';

var React = require('react/addons');
var $ = require('jquery');
var Base64 = require('../base64');

module.exports = React.createClass({displayName: 'AjaxSearchForm',
  propTypes: {
    url: React.PropTypes.string.isRequired,
    reloadAction: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    $(this.refs.form.getDOMNode()).submit(function (e) {
      e.preventDefault();
      this.onSubmit();
    }.bind(this));
  },

  onSubmit: function () {
    var data = [];

    for (var i in this.refs) {
      if (this.refs.hasOwnProperty(i) && i !== 'form') {
        var ref = this.refs[i];
        data.push('q[' + ref.query() + ']=' + ref.value());
      }
    }

    data = data.join('&');

    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (response) {
        global.history.pushState(data, '', '#' + Base64.urlsafeEncode64(data));
        this.props.reloadAction(response);
      }.bind(this)
    });
  },

  render: function () {
    return (
      React.DOM.form({method: '', action: '', ref: 'form'},
        React.Children.map(this.props.children, function (child, index) {
          return React.addons.cloneWithProps(child, { ref: 'child' + index });
        }),
        React.DOM.button({className: 'btn btn-block btn-default', type: 'button', onClick: this.onSubmit, style: { marginBottom: '15px'}},
          'Search'
        )
      )
    );
  }
});
