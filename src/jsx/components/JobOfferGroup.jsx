var JobOfferGroup = React.createClass({
  propTypes: {
    jobOfferGroup: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className="panel panel-default participant-group-panel">
        <div className="list-group">
          {this.props.jobOfferGroup.job_offers.map(function (jobOffer) {
            return <JobOffer jobOffer={jobOffer} />;
          })}
        </div>
      </div>
    )
  }
});
