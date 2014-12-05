/** @jsx React.DOM */

var CheckBoxFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    dataLink: React.PropTypes.object.isRequired
  },

  onChange: function (event) {
    var node = this.getDOMNode(),
        checkedIds = $.map($(node).find('input[type="checkbox"]:checked'), function (checkbox) {
          return checkbox.getAttribute("name").match(/\[(.*)\]/)[1];
        }),
        checkedOptions = this.props.options.filter(function (option) {
          return checkedIds.indexOf(option.id.toString()) >= 0;
        });

    if (checkedOptions.length === 0) {
      checkedOptions = this.props.options;
    }

    this.props.dataLink.requestChange(checkedOptions);
  },

  render: function () {
    if (this.isMounted()) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">{this.props.title}</div>
          <div className="list-group list-group-scrollable">
            {this.props.options.map(function (option) {
              return <label key={this.props.title+"_checkbox_"+option.id} className="list-group-item">
                <input type="checkbox" name={this.props.title.toLowerCase() + "[" + option.id + "]"} onChange={this.onChange} />
                <span className="title">{option.name}</span>
              </label>
            }.bind(this))}
          </div>
        </div>
      )
    } else {
      return <Spinner />
    }
  }
});
