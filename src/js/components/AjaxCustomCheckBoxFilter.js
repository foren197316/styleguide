/* @flow */
'use strict';

var React = require('react/addons');
var $ = require('jquery');
var UrlQueryMixin = require('../mixins').UrlQueryMixin;

module.exports = React.createClass({displayName: 'AjaxCustomCheckBoxFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired,
    submit: React.PropTypes.func.isRequired,
    mutuallyExclusive: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      mutuallyExclusive: true
    };
  },

  getInitialState: function () {
    return {
      isLoaded: !!this.props.store.data,
      ids: []
    };
  },

  getCheckedValues: function () {
    return this.props.store.data.map(function (datum) {
      if (this.getValueFromUrl(this.getFieldName(datum.id))) {
        return datum.id;
      }
    }, this).notEmpty();
  },

  componentDidMount: function () {
    if (!this.state.isLoaded) {
      this.stopListener = this.props.store.listen(function () {
        this.stopListener();
        var ids = this.getCheckedValues() || [];
        this.setState({ ids: ids, isLoaded: true });
      }.bind(this));
    } else {
      var ids = this.getCheckedValues() || [];
      this.setState({ ids: ids, isLoaded: true });
    }
  },

  onChange: function () {
    var $domNode = $(this.getDOMNode());
    var ids = $.map($domNode.find('input[type="checkbox"]:checked'), function (checkbox) {
      return checkbox.getAttribute('value');
    });
    this.setState({ ids: ids }, function () {
      this.props.submit();
    }.bind(this));
  },

  getFieldName: function (id) {
    return this.props.fieldName + '_' + id;
  },

  query: function () {
    if (this.state.ids.length === 0 || (this.props.mutuallyExclusive && this.state.ids.length !== 1)) {
      return null;
    }

    return this.state.ids.map(function (id) {
      return 'q[' + this.getFieldName(id) + ']=' + this.props.store.findById(id).value;
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
