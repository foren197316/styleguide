/** @jsx React.DOM */

var BooleanFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    action: React.PropTypes.object.isRequired /* TODO: require Reflux Actions */
  },

  onChange: function (event) {
    this.props.action(this.refs.checkbox.getDOMNode().checked);
  },

  render: function () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.title}</div>
        <div className="list-group list-group-scrollable">
          <label className="list-group-item">
            <input ref="checkbox" type="checkbox" name={this.props.title.toLowerCase()} onChange={this.onChange} />
            <span className="title">{this.props.label}</span>
          </label>
        </div>
      </div>
    )
  }
});
