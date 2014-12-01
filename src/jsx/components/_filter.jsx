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
        <div>
          <h5>{this.props.title}</h5>
          <ul>
            {this.props.options.map(function (option) {
              return <li>
                <label><input type="checkbox" name={this.props.title.toLowerCase() + "[" + option.id + "]"} onChange={this.onChange} /> {option.name}</label>
              </li>
            }.bind(this))}
          </ul>
        </div>
      )
    } else {
      return <Spinner />
    }
  }
});

var RadioGroupFilter = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
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
