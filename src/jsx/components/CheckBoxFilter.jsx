/** @jsx React.DOM */

var CheckBoxFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired, /* TODO: require Reflux Store */
    actions: React.PropTypes.object.isRequired /* TODO: require Reflux Actions */
  },

  getInitialState: function () {
    return { isLoaded: false };
  },

  componentDidMount: function () {
    this.stopListener = this.props.store.listen(function () {
      this.stopListener();
      this.setState({ isLoaded: true });
    }.bind(this));
  },

  onChange: function (event) {
    this.props.actions.filterByIds(
      $.map($(this.getDOMNode()).find('input[type="checkbox"]:checked'), function (checkbox) {
        return parseInt(checkbox.getAttribute("name").match(/\[(.*)\]/)[1]);
      })
    );
  },

  render: function () {
    if (this.props.store.permission && this.props.store.data.length > 0 && this.state.isLoaded) {
      return (
        <div className="panel panel-default">
          <div className="panel-heading">{this.props.title}</div>
          <div className="list-group list-group-scrollable">
            {this.props.store.data.map(function (option) {

              return <label key={this.props.title+"_checkbox_"+option.id} className="list-group-item">
                <input type="checkbox" name={this.props.title.toLowerCase() + "[" + option.id + "]"} onChange={this.onChange} />
                <span className="title">{option.name}</span>
              </label>
            }.bind(this))}
          </div>
        </div>
      )
    }

    return null;
  }
});
