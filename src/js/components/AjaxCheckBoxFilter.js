'use strict';

var React = require('react/addons');
var $ = require('jquery');

module.exports = React.createClass({displayName: 'CheckBoxFilter',
  propTypes: {
    title: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired, /* TODO: require Reflux Store */
    actions: React.PropTypes.object.isRequired /* TODO: require Reflux Actions */
  },

  getInitialState: function () {
    return {
      isLoaded: !!this.props.store.data
    };
  },

  componentDidMount: function () {
    if (!this.state.isLoaded) {
      this.stopListener = this.props.store.listen(function () {
        this.stopListener();
        this.setState({ isLoaded: true });
      }.bind(this));
    }
  },

  onChange: function () {
    var ids = $.map($(this.getDOMNode()).find('input[type="checkbox"]:checked'), function (checkbox) {
      return checkbox.getAttribute('value');
    });
    this.props.actions.filterByIds(ids);
  },

  render: function () {
    if (this.props.store.permission && this.props.store.data.length > 0 && this.state.isLoaded) {
      return (
        React.DOM.div({className: 'panel panel-default'},
          React.DOM.div({className: 'panel-heading'}, this.props.title),
          React.DOM.div({className: 'list-group list-group-scrollable'},
            this.props.store.data.map(function (option) {

              return React.DOM.label({key: this.props.title+'_checkbox_'+option.id, className: 'list-group-item'},
                React.DOM.input({type: 'checkbox', name: this.props.title.toLowerCase() + '[' + option.id + ']', value: option.id, onChange: this.onChange}),
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
