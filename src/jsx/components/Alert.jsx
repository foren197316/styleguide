/** @jsx React.DOM */

function AlertAction (title, url) {
  this.title = title;
  this.url = url;
}

var Alert = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(["warning", "success", "danger", "info", "primary", "default"]).isRequired,
    message: React.PropTypes.string.isRequired,
    instructions: React.PropTypes.string,
    action: React.PropTypes.instanceOf(AlertAction),
    closeable: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      closeable: true
    }
  },

  render: function () {
    var action = this.props.action
      ? <span>
          &nbsp;
          <a className="alert-link" href={this.props.action.url}>{this.props.action.title}</a>.
        </span>
      : null;

    return (
      <div className={"alert alert-" + this.props.type}>
        {this.props.closeable ? <AlertClose /> : null}
        <strong>{this.props.message}</strong><br/>
        <span>{this.props.instructions}</span>
        {action}
      </div>
    )
  }
});

var AlertClose = React.createClass({
  render: function () {
    return (
      <button type="button" className="close" data-dismiss="alert">
        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
      </button>
    )
  }
});
