/* @flow */
'use strict';

var React = require('react/addons');
var $ = require('jquery');
var UrlQueryMixin = require('../mixins').UrlQueryMixin;

module.exports = React.createClass({displayName: 'AjaxCheckBoxFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      isLoaded: !!this.props.store.data,
      ids: []
    };
  },

  setCheckedValues: function () {
    var ids = this.getValueFromUrl(this.searchField());

    if (ids != null) {
      this.setState({ ids: ids });
    }
  },

  componentDidMount: function () {
    if (!this.state.isLoaded) {
      this.stopListener = this.props.store.listen(function () {
        this.stopListener();
        this.setState({ isLoaded: true });
        this.setCheckedValues();
      }.bind(this));
    } else {
      this.setCheckedValues();
    }
  },

  onChange: function () {
    var ids = $.map($(this.getDOMNode()).find('input[type="checkbox"]:checked'), function (checkbox) {
      return checkbox.getAttribute('value');
    });
    this.setState({ ids: ids });
  },

  searchField: function () {
    return this.props.fieldName + '_eq_any';
  },

  query: function () {
    if (this.state.ids.length === 0) {
      return null;
    }

    var base = 'q[' + this.searchField() + '][]=';
    return this.state.ids.map(function (id) {
      return base + id;
    }, this).join('&');
  },

  render: function () {
    if (this.props.store.permission && this.props.store.data.length > 0 && this.state.isLoaded) {
      return (
        React.DOM.div({className: 'panel panel-default'},
          React.DOM.div({className: 'panel-heading'}, this.props.title),
          React.DOM.div({className: 'list-group list-group-scrollable'},
            this.props.store.data.map(function (option) {
              var checkboxAttributes = {
                type: 'checkbox',
                name: this.props.title.toLowerCase() + '[' + option.id + ']',
                value: option.id,
                onChange: this.onChange
              };

              if (this.state.ids.indexOf(option.id) >= 0) {
                checkboxAttributes.checked = 'checked';
              }

              return React.DOM.label({key: this.props.title+'_checkbox_'+option.id, className: 'list-group-item'},
                React.DOM.input(checkboxAttributes),
                React.DOM.span({className: 'title'}, option.name)
              );
            }.bind(this))
          )
        )
      );
    }

    return null;
  }
});
