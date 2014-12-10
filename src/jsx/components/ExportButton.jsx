/** @jsx React.DOM */

var HiddenIdInput = React.createClass({
  propTypes: {
    id: React.PropTypes.number.isRequired
  },

  render: function () {
    return <input type="hidden" name="ids[]" value={this.props.id} />
  }
});

var ExportButton = React.createClass({
  propTypes: {
    ids: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <form action={this.props.url} method="POST">
        <button className="btn btn-default" type="submit" style={{ marginBottom: "15px" }}>
          <i className="fa fa-download"></i>
          &nbsp;
          Export to CSV
        </button>
        {this.props.ids.map(function (id) {
          return <HiddenIdInput id={id} key={"hidden_input_"+id} />
        })}
      </form>
    )
  }
});
