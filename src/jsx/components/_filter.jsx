var RadioGroupFilterMixin = {
  createRadioGroupFilter: function (data, dataState, filteredAttributeKey, presentationName) {
    if (! data || ! dataState || ! filteredAttributeKey) {
      console.warn("createRadioGroupFilter requires data, dataState, and filteredAttributeKey");
    }

    var actualPresentationName = capitaliseWord(presentationName || filteredAttributeKey);

    return <RadioGroupFilter data={data} dataState={dataState} filteredAttributeKey={filteredAttributeKey} presentationName={actualPresentationName} />;
  }
};

var RadioGroupFilter = React.createClass({
  handleChange: function (event) {
    var selectedId = event.target.value,
        filteredAttributeKey = this.props.filteredAttributeKey,
        groupPanels = this.props.data.filter(function (group) {
          var filteredAttribute = group[filteredAttributeKey],
              definitelyNotThere = (filteredAttribute === null || filteredAttribute === undefined);

          if (selectedId === "") {
            return true;
          } else if (selectedId === "-1" && definitelyNotThere) {
            return true;
          } else if (!definitelyNotThere && parseInt(filteredAttribute.id) === parseInt(selectedId)) {
            return true;
          }

          return false;
        });

    this.props.dataState.requestChange(groupPanels);
  },

  render: function () {
    var totalCount = 0,
        noneCount = 0,
        filteredAttributeKey = this.props.filteredAttributeKey,
        presentationName = this.props.presentationName,
        radioOptions = this.props.dataState.value.reduce(function (prev, curr) {
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
