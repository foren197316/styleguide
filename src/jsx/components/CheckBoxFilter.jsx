/** @jsx React.DOM */

var CheckBoxFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired, /* TODO: require Reflux Store */
    actions: React.PropTypes.object.isRequired, /* TODO: require Reflux Actions */
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
        checkedOptions = this.props.store.filter(filterFunc),
        noneChecked = checkedOptions.length === 0;

    if (noneChecked) {
      checkedOptions = this.props.store.staticData;
    }

    if (this.props.actions.setAllUnselectedState != undefined) {
      this.props.actions.setAllUnselectedState(noneChecked);
    }

    this.props.actions.setData(checkedOptions);
  },

  render: function () {
    if (this.isMounted()) {
      if (this.props.store.permission) {
        return (
          <div className="panel panel-default">
            <div className="panel-heading">{this.props.title}</div>
            <div className="list-group list-group-scrollable">
              {this.props.store.staticData.map(function (option) {
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
        return null;
      }
    } else {
      return <Spinner />
    }
  }
});
