var SearchFilter = React.createClass({
  statics: {
    inputCharacterMinimumDefault: 3,
    caseSensitiveDefault: false
  },

  propTypes: {
    title: React.PropTypes.string.isRequired,
    searchOn: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    dataLink: React.PropTypes.object.isRequired,
    inputCharacterMinimum: React.PropTypes.number,
    caseSensitive: React.PropTypes.bool
  },

  getInitialState: function () {
    return {
      lastSearch: null
    };
  },

  handleChange: function (event) {
    var value = event.target.value,
        searchOn = this.props.searchOn,
        inputCharacterMinimum = this.props.inputCharacterMinimum || SearchFilter.inputCharacterMinimumDefault,
        caseSensitive = typeof this.props.caseSensitive === "boolean" ? this.props.caseSensitive : SearchFilter.caseSensitiveDefault;

    if (value.length >= inputCharacterMinimum) {
      var filteredData;
      if (this.state.lastSearch !== null && value.indexOf(this.state.lastSearch) >= 0) {
        filteredData = this.props.dataLink.value;
      } else {
        filteredData = this.props.options;
      }

      var filterFunc = caseSensitive
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
    if (this.isMounted()) {
      return (
        <label className="list-group">
          <input type="search" name={"search_"+this.props.title} onChange={this.handleChange} value={this.state.lastSearch} className="list-group-item form-control" placeholder="Search" />
        </label>
      )
    } else {
      return <Spinner />
    }
  }
});
