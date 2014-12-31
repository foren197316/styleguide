var JobOffer = React.createClass({
  propTypes: {
    jobOffer: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <ParticipantGroupItemWrapper participant={this.props.jobOffer.participant}>
      </ParticipantGroupItemWrapper>
    )
  }
});
