/** @jsx React.DOM */

var DateRangeFilter = React.createClass({
  propTypes: {
    dataLink: React.PropTypes.object.isRequired,
    options:  React.PropTypes.array.isRequired,
    searchOn: React.PropTypes.string.isRequired
  },

  componentDidMount: function () {
    if (this.isMounted()) {
      $(this.getDOMNode())
        .find('.datepicker')
        .datepicker({autoclose: true, clearBtn: true})
        .on('hide', this.handleChange)
        .on('clear', this.handleChange);
    }
  },

  handleChange: function (event) {
    var startFromDate = Date.parse($(this.getDOMNode()).find('.datepicker.start.from').val()),
        startToDate   = Date.parse($(this.getDOMNode()).find('.datepicker.start.to').val()),
        finishFromDate= Date.parse($(this.getDOMNode()).find('.datepicker.finish.from').val()),
        finishToDate  = Date.parse($(this.getDOMNode()).find('.datepicker.finish.to').val()),
        searchFrom    = this.props.searchFrom,
        searchTo      = this.props.searchTo,
        options       = this.props.options,
        optionsLink   = this.props.dataLink.value,
        filteredData  = null;

    if (startFromDate === null && startToDate === null && finishFromDate === null && finishToDate === null) {
      filteredData = options;
    } else {
      filteredData = options.filter(function (option) {
        var startGreaterThan = option[searchFrom].reduce(function (prev, curr) {
                                  return prev || (startFromDate !== null && Date.compare(curr, startFromDate) >= 0);
                                }, false),
            startLessThan    = option[searchFrom].reduce(function (prev, curr) {
                                  return prev || (startToDate !== null && Date.compare(curr, startToDate) <= 0);
                                }, false);
            finishGreaterThan = option[searchTo].reduce(function (prev, curr) {
                                  return prev || (finishFromDate !== null && Date.compare(curr, finishFromDate) >= 0);
                                }, false),
            finishLessThan    = option[searchTo].reduce(function (prev, curr) {
                                  return prev || (finishToDate !== null && Date.compare(curr, finishToDate) <= 0);
                                }, false);

        return (
                (startFromDate  === null || startGreaterThan)   &&
                (startToDate    === null || startLessThan)      &&
                (finishFromDate === null || finishGreaterThan)  &&
                (finishToDate   === null || finishLessThan)
               )
      });
    }

    this.props.dataLink.requestChange(filteredData);
  },

  render: function () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Start</div>
        <div className="list-group list-group-scrollable">
          <label className="list-group-item">
            <span className="title">From</span>
            <input type="text" className="datepicker start from form-control" />
          </label>
          <label className="list-group-item">
            <span className="title">To</span>
            <input type="text" className="datepicker start to form-control" />
          </label>
        </div>
        <div className="panel-heading">Finish</div>
        <div className="list-group list-group-scrollable">
          <label className="list-group-item">
            <span className="title">From</span>
            <input type="text" className="datepicker finish from form-control" />
          </label>
          <label className="list-group-item">
            <span className="title">To</span>
            <input type="text" className="datepicker finish to form-control" />
          </label>
        </div>
      </div>
    )
  }
});
