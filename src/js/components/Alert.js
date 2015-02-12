'use strict';

var React = require('react/addons');

var AlertClose = React.createClass({displayName: 'AlertClose',
  render: function () {
    return (
      React.DOM.button({type: 'button', className: 'close', 'data-dismiss': 'alert'},
        React.DOM.span({'aria-hidden': 'true'}, '×'), React.DOM.span({className: 'sr-only'}, 'Close')
      )
    );
  }
});

var Alert = React.createClass({displayName: 'Alert',
  propTypes: {
    type: React.PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary', 'default']).isRequired,
    message: React.PropTypes.string.isRequired,
    instructions: React.PropTypes.string,
    actionTitle: React.PropTypes.string,
    actionUrl: React.PropTypes.string,
    closeable: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      closeable: true
    };
  },

  render: function () {
    var action = this.props.actionTitle && this.props.actionUrl ?
      React.DOM.span(null,
          ' ',
          React.DOM.a({className: 'alert-link', href: this.props.actionUrl}, this.props.actionTitle), '.'
      ) :
      null;

    return (
      React.DOM.div({className: 'alert alert-' + this.props.type},
        this.props.closeable ? AlertClose(null) : null,
        React.DOM.strong(null, this.props.message), React.DOM.br(null),
        React.DOM.span(null, this.props.instructions),
        action
      )
    );
  }
});

module.exports = Alert;
