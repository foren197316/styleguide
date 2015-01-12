var ProgramHeader = React.createClass({
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
      <h2 className="page-header">
        {this.programName()}
        <small className="pull-right">
          {this.collectionLength()} {this.collectionName()}
        </small>
      </h2>
    )
  }
});
