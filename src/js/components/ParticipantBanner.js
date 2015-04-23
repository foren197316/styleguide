'use strict';
let React = require('react/addons');
let { div, h4 } = React.DOM;

let ImagePicker = React.createFactory(require('./ImagePicker'));

let ParticipantBanner = React.createClass({
  displayName: 'ParticipantBanner',

  propTypes: {
    participant: React.PropTypes.object.isRequired
  },

  render () {
    let participant = this.props.participant;

    return (
      div({className: 'media'},
        div({className: 'pull-left'},
          ImagePicker({
            alt: participant.name,
            anchorTitle: 'Choose Photo',
            imageClassName: 'media-object img-circle img-thumbnail',
            src: participant.photo_url
          })
        ),
        div({className: 'media-body'},
          div({className: 'row'},
            div({className: 'col-xs-12'},
              h4({className: 'media-heading'}, participant.name)
            )
          )
        )
      )
    );
  }
});

module.exports = ParticipantBanner;
