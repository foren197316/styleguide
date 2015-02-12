/* @flow */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({displayName: 'AjaxSearchForm',
  propTypes: {
    actions: React.PropTypes.object.isRequired,
    formSending: React.PropTypes.object.isRequired,
    delay: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      delay: 750
    };
  },

  getInitialState: function () {
    return { lastData: null };
  },

  ajaxPost: function () {
    var data = [];

    for (var i in this.refs) {
      if (this.refs.hasOwnProperty(i)) {
        data.push(this.refs[i].query());
      }
    }

    data = data.filter(function (datum) {
      return datum != null;
    }).join('&');

    if (data === this.state.lastData) {
      return;
    }

    this.props.formSending.requestChange(true);
    this.setState({ lastData: data });

    this.props.actions.ajaxSearch(data, function () {
      this.props.formSending.requestChange(false);
    }.bind(this));
  },

  onSubmit: function (e) {
    if (e != null) {
      e.preventDefault();
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(this.ajaxPost.bind(this), this.props.delay);
  },

  render: function () {
    return React.DOM.form({method: '', action: '', onSubmit: this.onSubmit},
      React.Children.map(this.props.children, function (child, index) {
        return React.addons.cloneWithProps(child, { ref: 'child' + index, submit: this.onSubmit });
      }.bind(this))
    );
  }
});
