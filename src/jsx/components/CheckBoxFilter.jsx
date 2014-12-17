/** @jsx React.DOM */

var CheckBoxFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    actions: React.PropTypes.object.isRequired, /* TODO: require Reflux Actions */
    nestedAttribute: React.PropTypes.oneOf([
      React.PropTypes.string,
      React.PropTypes.array
    ])
  },

  onChange: function (event) {
    var checkedIds = $.map($(this.getDOMNode()).find('input[type="checkbox"]:checked'), function (checkbox) {
          return checkbox.getAttribute("name").match(/\[(.*)\]/)[1];
        });

    this.props.actions.filterByIds(checkedIds, this.props.nestedAttribute);
  },

  render: function () {
    if (this.props.store.permission) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">{this.props.title}</div>
          <div className="list-group list-group-scrollable">
            {this.props.store.data.map(function (option) {
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
    }

    return null;
  }
});
