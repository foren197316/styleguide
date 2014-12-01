var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return { data: null };
  },

  componentDidMount: function() {
    if (this.props.initialData == undefined) {
      $.get(this.props.source, function(data) {
        if (this.isMounted()) {
          this.setProps({
            initialData: data.offered_participant_groups
          });

          this.setState({
            data: data.offered_participant_groups
          });
        }
      }.bind(this));
    }
  },

  render: function() {
    if (this.state.data && this.isMounted()) {
      var dataLink = this.linkState('data');

      return (
        <div className="row">
          <div className="col-md-3">
            <RadioGroupFilter data={this.props.initialData} dataLink={dataLink} filteredAttributeKey="program" />
            <RadioGroupFilter data={this.props.initialData} dataLink={dataLink} filteredAttributeKey="staff" presentationName="coordinator" />
            <RadioGroupFilter data={this.props.initialData} dataLink={dataLink} filteredAttributeKey="employer" />
          </div>
          <div className="col-md-9">
            <OfferedParticipantGroups dataLink={dataLink} />
          </div>
        </div>
      );
    } else {
      return <Spinner />
    };
  }
});

var OfferedParticipantGroups = React.createClass({
  render: function () {
    return (
      <div id="participant-group-panels">
        {this.props.dataLink.value.map(function (group) {
          return <OfferedParticipantGroupPanel data={group} key={group.id} />;
        })}
      </div>
    )
  }
});
