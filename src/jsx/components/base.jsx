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

var TooltippedIcon = React.createClass({
  componentDidMount: function() {
    $(this.getDOMNode()).tooltip();
  },

  render: function() {
    return (
      <i className={this.props.iconClass}/>
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

var RadioGroupButton = React.createClass({
  handleChange: function(event) {
    var $buttonGroup = event.target.parentNode.parentNode,
        $buttons = $buttonGroup.querySelectorAll('.btn'),
        $radios = $buttonGroup.querySelectorAll('input[type="radio"]');

    for (var i=0; i < $buttons.length; i++) {
      var $button = $buttons[i],
          $radio = $radios[i];

      $button.className = $button.className.replace("active", "");

      if ($radio.checked) {
        $button.className = $button.className + " active";
      }
    }
  },

  render: function() {
    return (
      <label className="btn btn-default btn-sm" htmlFor={this.props.htmlFor}>
        <input type="radio" id={this.props.id} value={this.props.inputValue} onChange={this.handleChange} />
        <i className={this.props.iconClass}></i>
        {this.props.title}
      </label>
    )
  }
});
