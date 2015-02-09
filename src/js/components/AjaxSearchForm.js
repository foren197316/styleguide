/* @flow */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({displayName: 'AjaxSearchForm',
  propTypes: {
    url: React.PropTypes.string.isRequired,
    actions: React.PropTypes.object.isRequired,
    includedStores: React.PropTypes.array,
    formSending: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      includedStores: []
    };
  },

  onSubmit: function (e) {
    if (e != null) {
      e.preventDefault();
    }

    var data = [];
    this.props.formSending.requestChange(true);

    for (var i in this.refs) {
      if (this.refs.hasOwnProperty(i)) {
        data.push(this.refs[i].query());
      }
    }

    data = data.filter(function (datum) {
      return datum != null;
    }).join('&');

    this.props.actions.ajaxSearch(data, function () {
      this.props.formSending.requestChange(false);
    }.bind(this));
  },

  render: function () {
    return React.DOM.form({method: '', action: '', onSubmit: this.onSubmit},
      React.Children.map(this.props.children, function (child, index) {
        return React.addons.cloneWithProps(child, { ref: 'child' + index, submit: this.onSubmit });
      }.bind(this))
    );
  }
});
