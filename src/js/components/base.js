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
