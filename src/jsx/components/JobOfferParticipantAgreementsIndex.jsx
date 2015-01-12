var JobOfferParticipantAgreementsIndex = React.createClass({
  mixins: [SetUrlsMixin],

  render: function () {
    return (
      <div className="row">
        <div className="col-md-3">
        </div>
        <div className="col-md-9">
          <JobOfferParticipantAgreementsPanel />
        </div>
      </div>
    )
  }
});
