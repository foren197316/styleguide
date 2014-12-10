/** @jsx React.DOM */

var CheckBoxFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    dataLink: React.PropTypes.object.isRequired, /* ReactLink */
    nestedAttribute: React.PropTypes.string,
    allUnselectedLink: React.PropTypes.object    /* ReactLink */
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
        checkedOptions = this.props.options.filter(filterFunc),
        noneChecked = checkedOptions.length === 0;

    if (noneChecked) {
      checkedOptions = this.props.options;
    }

    if (this.props.allUnselectedLink != undefined) {
      this.props.allUnselectedLink.requestChange(noneChecked);
    }

    this.props.dataLink.requestChange(checkedOptions);
  },

  onClear: function () {
    $(this.getDOMNode()).find('input[type="checkbox"]:checked').removeAttr("checked");

    if (this.props.allUnselectedLink != undefined) {
      this.props.allUnselectedLink.requestChange(true);
    }

    this.props.dataLink.requestChange(this.props.options);
  },

  render: function () {
    if (this.isMounted()) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading clearfix">
            <div className="panel-title pull-left">{this.props.title}</div>
            <div className="pull-right">
              <button onClick={this.onClear} className="btn btn-default btn-xs">Clear</button>
            </div>
          </div>
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
