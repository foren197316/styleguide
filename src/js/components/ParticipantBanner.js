'use strict';
let React = require('react/addons');
let { div, h3 } = React.DOM;

let ImagePicker = React.createFactory(require('./ImagePicker'));

let ParticipantBanner = React.createClass({
  displayName: 'ParticipantBanner',

  propTypes: {
    participant: React.PropTypes.object.isRequired
  },

  render () {
    let participant = this.props.participant;

    return (
      div({className: 'panel panel-default participant-group-panel'},
        div({className: 'panel-body'},
          div({className: 'media'},
            div({className: 'pull-left'},
              ImagePicker({
                alt: participant.name,
                anchorTitle: 'Choose Photo',
                imageClassName: 'media-object img-circle img-thumbnail',
                url: participant.photo_url,
                updateEndpoint: `/photos/${participant.photo_id}.json`
              })
            ),
            div({className: 'media-body'},
              div({className: 'row'},
                div({className: 'col-xs-12'},
                  h3({className: 'media-heading'}, participant.name)
                )
              )
            )
          )
        )
      )
    );
  }
});

module.exports = ParticipantBanner;
