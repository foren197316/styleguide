var SearchFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    searchOn: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    dataLink: React.PropTypes.object.isRequired,
    inputCharacterMinimum: React.PropTypes.number,
    caseSensitive: React.PropTypes.bool,
    autoFocus: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      inputCharacterMinimum: 3,
      caseSensitive: false,
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
        searchOn = this.props.searchOn;

    if (value.length >= this.props.inputCharacterMinimum) {
      var filteredData;
      if (this.state.lastSearch !== null && value.indexOf(this.state.lastSearch) >= 0) {
        filteredData = this.props.dataLink.value;
      } else {
        filteredData = this.props.options;
      }

      var filterFunc = this.props.caseSensitive
            ? function (entry) {
                return value.split(/\s+/).reduce(function (prev, curr) {
                  return prev && entry[searchOn].indexOf(curr) >= 0;
                }, true);
              }
            : function (entry) {
                var lowerEntry = entry[searchOn].toLowerCase();
                return value.toLowerCase().split(/\s+/).reduce(function (prev, curr) {
                  return prev && lowerEntry.indexOf(curr) >= 0;
                }, true);
              };

      filteredData = filteredData.filter(filterFunc);

      this.props.dataLink.requestChange(filteredData);
    } else {
      this.props.dataLink.requestChange(this.props.options);
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
