/* @flow */
'use strict';

var React = require('react/addons');
var $ = require('jquery');
var { UrlQueryMixin } = require('../mixins');

let AjaxCheckBoxFilter = React.createClass({
  displayName: 'AjaxCheckBoxFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    submit: React.PropTypes.func.isRequired,
    store: React.PropTypes.object.isRequired,
    predicate: React.PropTypes.oneOf(['eq_any', 'in_overlap']),
  },

  getDefaultProps () {
    return {
      predicate: 'eq_any'
    };
  },

  getInitialState: function () {
    return {
      isLoaded: !!this.props.store.data,
      ids: []
    };
  },

  getCheckedValues: function () {
    return this.getValueFromUrl(this.searchField());
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
      this.setState({ ids: ids });
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

  searchField: function () {
    return `${this.props.fieldName}_${this.props.predicate}`;
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
      var stringIds = this.state.ids.map(function (obj) { return obj.toString(); });

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

              if (stringIds.indexOf(option.id.toString()) >= 0) {
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

module.exports = AjaxCheckBoxFilter;
