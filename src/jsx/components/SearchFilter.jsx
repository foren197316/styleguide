var SearchFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    searchOn: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
    ]).isRequired,
    store: React.PropTypes.object.isRequired, /* TODO: require Reflux Store */
    actions: React.PropTypes.object.isRequired, /* TODO: require Reflux Actions */
    inputCharacterMinimum: React.PropTypes.number,
    autoFocus: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      inputCharacterMinimum: 3,
      autoFocus: true
    }
  },

  getInitialState: function () {
    return {
      lastSearch: null
    };
  },

  componentDidMount: function () {
    if (this.props.autoFocus) {
      this.refs["searchInput"].getDOMNode().focus();
    }
  },

  handleChange: function (event) {
    var value = event.target.value,
        searchOn = this.props.searchOn instanceof Array
          ? this.props.searchOn
          : [this.props.searchOn];

    if (value.length >= this.props.inputCharacterMinimum) {
      var filteredData;
      if (this.state.lastSearch !== null && value.indexOf(this.state.lastSearch) >= 0) {
        filteredData = this.props.store.data;
      } else {
        filteredData = this.props.store.staticData;
      }

      var containsFunc = function (entry, term) {
        return searchOn.reduce(function (prev, curr) {
          return prev || (entry[curr] || "").toLowerCase().indexOf(term) >= 0;
        }, false);
      }

      filteredData = filteredData.filter(function (entry) {
        return value.toLowerCase().split(/\s+/).reduce(function (prev, curr) {
          return prev && containsFunc(entry, curr);
        }, true);
      });

      this.props.actions.setData(filteredData);
    } else {
      this.props.actions.setData(this.props.store.staticData);
    }

    this.setState({
      lastSearch: value
    });
  },

  render: function () {
    return (
      <label className="list-group">
        <input type="search" ref="searchInput" name={"search_"+this.props.title} onChange={this.handleChange} value={this.state.lastSearch} className="list-group-item form-control" placeholder="Search" />
      </label>
    )
  }
});
