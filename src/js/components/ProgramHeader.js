'use strict';



var ProgramHeader = React.createClass({displayName: 'ProgramHeader',
  propTypes: {
    program: React.PropTypes.object.isRequired,
    collectionName: React.PropTypes.string.isRequired,
    collection: React.PropTypes.array.isRequired
  },

  programName: function () {
    return this.props.program.name;
  },

  collectionName: function () {
    return this.props.collectionName.pluralize(this.collectionLength());
  },

  collectionLength: function () {
    return this.props.collection.length;
  },

  render: function () {
    return (
      React.DOM.h2({className: 'page-header'},
        this.programName(),
        React.DOM.small({className: 'pull-right'},
          this.collectionLength(), ' ', this.collectionName()
        )
      )
    );
  }
});

module.exports = ProgramHeader;
