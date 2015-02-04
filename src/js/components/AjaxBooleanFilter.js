'use strict';

var React = require('react/addons');

module.exports = React.createClass({displayName: 'BooleanFilter',
  propTypes: {
    title: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    action: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return { isChecked: false };
  },

  onChange: function () {
    var isChecked = !this.state.isChecked;
    this.setState({ isChecked: isChecked });
    this.props.action(isChecked);
  },

  render: function () {
    return (
      React.DOM.div({className: 'panel panel-default'},
        React.DOM.div({className: 'panel-heading'}, this.props.title),
        React.DOM.div({className: 'list-group list-group-scrollable'},
          React.DOM.label({className: 'list-group-item'},
            React.DOM.input({ref: 'checkbox', type: 'checkbox', name: this.props.title.toLowerCase(), onChange: this.onChange}),
            React.DOM.span({className: 'title'}, this.props.label)
          )
        )
      )
    );
  }
});
