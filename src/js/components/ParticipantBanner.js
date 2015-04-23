'use strict';
let React = require('react/addons');
let { a, div, img, h4 } = React.DOM;

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
          a({href:'#', title: 'Choose Photo', style: {'display': 'block'}},
            img({className: 'media-object img-circle img-thumbnail', src: `${participant.photo_url}/convert?h=100&w=100&fit=crop`, alt: participant.name})
          )
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
