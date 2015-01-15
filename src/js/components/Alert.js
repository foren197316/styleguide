function AlertAction (title, url) {
  this.title = title;
  this.url = url;
}

var Alert = React.createClass({displayName: 'Alert',
  propTypes: {
    type: React.PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary', 'default']).isRequired,
    message: React.PropTypes.string.isRequired,
    instructions: React.PropTypes.string,
    action: React.PropTypes.instanceOf(AlertAction),
    closeable: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      closeable: true
    };
  },

  render: function () {
    var action = this.props.action ?
      React.DOM.span(null,
          ' ',
          React.DOM.a({className: 'alert-link', href: this.props.action.url}, this.props.action.title), '.'
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

var AlertClose = React.createClass({displayName: 'AlertClose',
  render: function () {
    return (
      React.DOM.button({type: 'button', className: 'close', 'data-dismiss': 'alert'},
        React.DOM.span({'aria-hidden': 'true'}, '×'), React.DOM.span({className: 'sr-only'}, 'Close')
      )
    );
  }
});
