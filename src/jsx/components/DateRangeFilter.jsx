/** @jsx React.DOM */

var DateRangeFilter = React.createClass({
  propTypes: {
    searchFrom: React.PropTypes.string.isRequired,
    searchTo: React.PropTypes.string.isRequired,
    actions:  React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    $(this.getDOMNode())
      .find('.datepicker')
      .datepicker({autoclose: true, clearBtn: true})
      .on('hide', this.handleChange)
      .on('clear', this.handleChange);
  },

  handleChange: function (event) {
    var startFromDate = Date.parse(this.refs.start_from.getDOMNode().value),
        startToDate   = Date.parse(this.refs.start_to.getDOMNode().value),
        finishFromDate= Date.parse(this.refs.finish_from.getDOMNode().value),
        finishToDate  = Date.parse(this.refs.finish_to.getDOMNode().value);

    this.props.actions.dateFilter(
      this.props.searchFrom,
      this.props.searchTo,
      startFromDate,
      startToDate,
      finishFromDate,
      finishToDate
    );
  },

  render: function () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Start</div>
        <div className="list-group list-group-scrollable">
          <label className="list-group-item">
            <span className="title">From</span>
            <input type="text" ref="start_from" className="datepicker start from form-control" />
          </label>
          <label className="list-group-item">
            <span className="title">To</span>
            <input type="text" ref="start_to" className="datepicker start to form-control" />
          </label>
        </div>
        <div className="panel-heading">Finish</div>
        <div className="list-group list-group-scrollable">
          <label className="list-group-item">
            <span className="title">From</span>
            <input type="text" ref="finish_from" className="datepicker finish from form-control" />
          </label>
          <label className="list-group-item">
            <span className="title">To</span>
            <input type="text" ref="finish_to" className="datepicker finish to form-control" />
          </label>
        </div>
      </div>
    )
  }
});
