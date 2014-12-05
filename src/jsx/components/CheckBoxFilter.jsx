/** @jsx React.DOM */

var CheckBoxFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    dataLink: React.PropTypes.object.isRequired,
    nestedAttribute: React.PropTypes.string
  },

  onChange: function (event) {
    var node = this.getDOMNode(),
        nestedAttribute = this.props.nestedAttribute,
        checkedIds = $.map($(node).find('input[type="checkbox"]:checked'), function (checkbox) {
          return checkbox.getAttribute("name").match(/\[(.*)\]/)[1];
        }),
        filterFunc = nestedAttribute
          ? function (option) {
              return checkedIds.indexOf(option[nestedAttribute].id.toString()) >= 0;
            }
          : function (option) {
              return checkedIds.indexOf(option.id.toString()) >= 0;
            },
        checkedOptions = this.props.options.filter(filterFunc);

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
              var filterOption = this.props.nestedAttribute
                ? option[this.props.nestedAttribute]
                : option;

              return <label key={this.props.title+"_checkbox_"+filterOption.id} className="list-group-item">
                <input type="checkbox" name={this.props.title.toLowerCase() + "[" + filterOption.id + "]"} onChange={this.onChange} />
                <span className="title">{filterOption.name}</span>
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
