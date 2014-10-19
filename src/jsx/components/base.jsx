/** @jsx React.DOM */

var Spinner = React.createClass({
  render: function() {
    return (
      <i className="fa fa-spinner fa-spin"></i>
    )
  }
});

var GenderIcon = React.createClass({
  render: function() {
    var genderIconClass = "fa fa-" + this.props.gender.toLowerCase();

    return (
      <i className={genderIconClass}></i>
    )
  }
});

var TooltippedYearCalculator = React.createClass({
  componentDidMount: function() {
    $(this.getDOMNode()).tooltip();
  },

  render: function() {
    var to = Date.today(this.props.to),
        from = Date.parse(this.props.from),
        period = new TimePeriod(to, from);

    return (
      <span data-toggle="tooltip" data-placement="top" title={this.props.tooltipTitle}>
        {period.years}
      </span>
    )
  }
});

var TooltippedIconSpan = React.createClass({
  componentDidMount: function() {
    $(this.getDOMNode()).tooltip();
  },

  render: function() {
    return (
      <span data-toggle="tooltip" data-placement="top" title={this.props.tooltipTitle}>
        <i className={this.props.iconClass}></i>
        {this.props.spanContent}
      </span>
    )
  }
});
