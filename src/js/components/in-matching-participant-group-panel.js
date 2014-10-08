/** @jsx React.DOM */

var InMatchingParticipantGroupPanels = React.createClass({
  getInitialState: function() {
    return {
      employer: null,
      participant_groups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          employer: data.employer,
          participant_groups: data.participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employer = this.state.employer,
          participantGroupNodes = this.state.participant_groups.map(function (participantGroup) {
        return (
          <InMatchingParticipantGroup key={participantGroup.id} data={participantGroup} employer={employer} />
        );
      });

      return (
        <div id="participant-group-panels">
          {participantGroupNodes}
        </div>
      );
    } else {
      return <Spinner />
    };
  }
});

var InMatchingParticipantGroup = React.createClass({
  getInitialState: function() {
    return { sending: false, puttingOnReview: false };
  },

  handlePutOnReview: function(event) {
    this.setState({ puttingOnReview: true });
  },

  handleCancel: function(event) {
    this.setState({ puttingOnReview: false });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        data = {
          on_review_participant_group: {
            employer_id: this.props.employer.id,
            in_matching_participant_group_id: this.props.data.id
          }
        };

    $.ajax({
        url: "/on_review_participant_groups.json",
        type: "POST",
        data: data,
        success: function(data) {
          React.unmountComponentAtNode(node);
          $(node).remove();
        },
        error: function(data) {
          window.location = window.location;
        }
    });
  },

  render: function() {
    var actionRow,
        putOnReviewEndDate = Date.today().add(3).days().toString('yyyy-MM-dd'),
        participantPluralized = this.props.data.applications.length > 1 ? 'participants' : 'participant';
        applicationNodes = this.props.data.applications.map(function (application) {
        return (
          <ParticipantGroupApplication key={application.id} data={application} />
        )
      });

    if (this.state.puttingOnReview) {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <div className="btn-group pull-right clearfix">
            <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
            <span className="btn btn-default" onClick={this.handleCancel}>Cancel</span>
          </div>
        </div>
        <div className="col-xs-12">
          <hr />
          <p className="panel-text">You will have until <strong>{putOnReviewEndDate}</strong> to offer a position or decline the {participantPluralized}.</p>
          <p className="panel-text">If you take no action by <strong>{putOnReviewEndDate}</strong>, the {participantPluralized} will automatically be removed from your On Review list.</p>
        </div>
      </div>
    } else {
      actionRow = <div className="row">
        <div className="col-xs-6 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-6 col-sm-9">
          <button className="btn btn-success pull-right" onClick={this.handlePutOnReview}>Put on Review</button>
        </div>
      </div>
    }

    return (
      <div className="panel participant-group-panel">
        <div className="list-group">
            {applicationNodes}
          </div>
          <div className="panel-footer clearfix">
            {actionRow}
          </div>
        </div>
    )
  }
});

var ParticipantGroupApplication = React.createClass({
  render: function() {
    var listItemClass = this.props.data.gender == 'Female' ? 'list-group-item list-group-item-danger' : 'list-group-item list-group-item-info';

    return (
      <div className={listItemClass}>
        <div className="media">
          <img className="media-object img-circle img-thumbnail pull-left" src={this.props.data.photo_url} alt="{this.props.data.name}" />
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <h4 className="media-heading">{this.props.data.name}</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-4 col-lg-6">
                <i className="fa fa-globe"></i>
                <strong>{this.props.data.country}</strong>&nbsp;
              </div>
              <div className="col-xs-12 col-sm-2 text-right">
                <GenderIcon gender={this.props.data.gender} />
                21+
              </div>
              <div className="col-xs-12 col-sm-3 col-lg-2 text-right">
                <i className="fa fa-plane fa-flip-vertical"></i>
                {this.props.data.arrival_date}
              </div>
              <div className="col-xs-12 col-sm-3 col-lg-2 text-right">
                <i className="fa fa-plane"></i>
                {this.props.data.departure_date}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

