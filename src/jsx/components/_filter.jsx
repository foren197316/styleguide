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

var RadioGroupFilter = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    dataLink: React.PropTypes.object.isRequired,
    filteredAttributeKey: React.PropTypes.string.isRequired,
    presentationName: React.PropTypes.string
  },

  handleChange: function (event) {
    var selectedId = event.target.value,
        filteredAttributeKey = this.props.filteredAttributeKey,
        groupPanels = this.props.data.filter(function (group) {
          var filteredAttribute = group[filteredAttributeKey];

          if (selectedId === "") {
            return true;
          } else if (selectedId === "-1" && filteredAttribute == undefined) {
            return true;
          } else if (filteredAttribute != undefined && parseInt(filteredAttribute.id) === parseInt(selectedId)) {
            return true;
          }

          return false;
        });

    this.props.dataLink.requestChange(groupPanels);
  },

  render: function () {
    var totalCount = 0,
        noneCount = 0,
        filteredAttributeKey = this.props.filteredAttributeKey,
        presentationName = (this.props.presentationName || filteredAttributeKey).capitaliseWord(),
        radioOptions = this.props.dataLink.value.reduce(function (prev, curr) {
          totalCount++;

          var filteredAttribute = curr[filteredAttributeKey];

          if (filteredAttribute != undefined) {
            for (var i=0; i<prev.length; i++) {
              if (prev[i].id === filteredAttribute.id) {
                prev[i].count++;
                return prev;
              }
            }
            filteredAttribute.count = 1;
            prev.push(filteredAttribute);
          } else {
            noneCount++;
          }

          return prev;
        }, []).map(function (option) {
          return (
            <label className="list-group-item" key={option.id}>
              <span className="badge">{option.count}</span>
              <input type="radio" name={filteredAttributeKey} value={option.id} />
              <span className="title">{option.name}</span>
            </label>
          )
        }),
        noneRadio = function () {
          if (noneCount > 0) {
            return (
              <label className="list-group-item">
                <span className="badge">{noneCount}</span>
                <input type="radio" name={filteredAttributeKey} value="-1" />
                <span className="title">No {presentationName}</span>
              </label>
            )
          }
        }();

    return (
      <div name={filteredAttributeKey} className="list-group" onChange={this.handleChange}>
        <label className="list-group-item">
          <span className="badge">{totalCount}</span>
          <input type="radio" name={filteredAttributeKey} value="" defaultChecked />
          <span className="title">All {presentationName}s</span>
        </label>
        {radioOptions}
        {noneRadio}
      </div>
    )
  }
});

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

var DateRangeFilter = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    searchOn: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    dataLink: React.PropTypes.object.isRequired
  },

  componentDidMount: function () {
    if (this.isMounted()) {
      $(this.getDOMNode()).find('.datepicker.after').datepicker({autoclose: true, clearBtn: true}).on('hide', this.handleAfterChange).on('clear', this.handleBeforeChange);
      $(this.getDOMNode()).find('.datepicker.before').datepicker({autoclose: true, clearBtn: true}).on('hide', this.handleBeforeChange).on('clear', this.handleBeforeChange);
    }
  },

  handleAfterChange: function (event) {
    var value = Date.parse(event.target.value),
        searchOn = this.props.searchOn,
        options = this.props.options,
        filteredData = null;

    if (value === null) {
      filteredData = options;
    } else {
      filteredData = options.filter(function (participantGroup) {
        return participantGroup.start_dates.reduce(function (prev, curr) {
          return Date.compare(curr, value) > 0 || prev;
        }, false);
      });
    }

    this.props.dataLink.requestChange(filteredData);
  },

  handleBeforeChange: function (event) {
    var value = Date.parse(event.target.value),
        searchOn = this.props.searchOn,
        options = this.props.options,
        filteredData = null;

    if (value === null) {
      filteredData = options;
    } else {
      filteredData = options.filter(function (participantGroup) {
        return participantGroup.start_dates.reduce(function (prev, curr) {
          return Date.compare(curr, value) < 0 || prev;
        }, false);
      });
    }

    this.props.dataLink.requestChange(filteredData);
  },


  render: function () {

    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.title}</div>
        <div className="list-group list-group-scrollable">
          <label className="list-group-item">
            <span className="title">After</span>
            <input type="text" className="datepicker after form-control" name={"from_date_"+this.props.title} />
          </label>
          <label className="list-group-item">
            <span className="title">Before</span>
            <input type="text" className="datepicker before form-control" name={"to_date_"+this.props.title} />
          </label>
        </div>
      </div>
    )
  }
});
