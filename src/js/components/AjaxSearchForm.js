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

  getInitialState: function () {
    return {
      sending: false
    };
  },

  componentDidMount: function () {
    $(this.refs.form.getDOMNode()).submit(function (e) {
      e.preventDefault();
      this.onSubmit();
    }.bind(this));
  },

  onSubmit: function () {
    var data = [];
    this.setState({ sending: true });

    for (var i in this.refs) {
      if (this.refs.hasOwnProperty(i) && i !== 'form') {
        data.push(this.refs[i].query());
      }
    }

    data = data.filter(function (datum) {
      return datum != null;
    }).join('&');

    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (response) {
        global.history.pushState(data, '', '#' + Base64.urlsafeEncode64(data));
        this.setState({ sending: false });
        this.props.reloadAction(response);
      }.bind(this)
    });
  },

  render: function () {
    var buttonAttributes = {
      className: 'btn btn-block btn-default',
      type: 'button',
      onClick: this.onSubmit,
      style: { marginBottom: '15px'}
    };

    if (this.state.sending) {
      buttonAttributes.disabled = 'disabled';
    }

    return (
      React.DOM.form({method: '', action: '', ref: 'form'},
        React.DOM.button(buttonAttributes, 'Search'),
        React.Children.map(this.props.children, function (child, index) {
          return React.addons.cloneWithProps(child, { ref: 'child' + index });
        })
      )
    );
  }
});
