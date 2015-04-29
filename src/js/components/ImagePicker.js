'use strict';
let React = require('react/addons');
let filepicker = global.filepicker;
let { a, div, img } = React.DOM;
let { updateUrl } = require('../api');

let options = {
  debug: global.FILEPICKER_DEBUG,
  service: 'COMPUTER',
  mimetype: 'image/*'
};

let ImagePicker = React.createClass({
  displayName: 'ImagePicker',

  propTypes: {
    alt: React.PropTypes.string,
    anchorTitle: React.PropTypes.string,
    imageClassName: React.PropTypes.string,
    url: React.PropTypes.string,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    updateEndpoint: React.PropTypes.string.isRequired,
  },

  getInitialState () {
    return {
      url: this.props.url
    };
  },

  getDefaultProps () {
    return {
      width: 150,
      height: 150,
    };
  },

  filePicker () {
    filepicker.pick(
      options,
      Blob => {
        updateUrl(Blob.url, this.props.updateEndpoint)
          .then(() => {
            this.setState({ url: Blob.url });
          }, () => {
            global.location = global.location;
          });
      }
    );
  },

  getCroppedUrl () {
    let { width, height } = this.props;
    let { url } = this.state;

    if (!width || !height) {
      return url;
    }

    return `${url}/convert?w=${width}&h=${height}&fit=crop`;
  },

  render () {
    let { alt, anchorTitle, imageClassName } = this.props;
    let { url } = this.state;

    return (
      div({},
        a({ href: url, target: '_blank' },
          img({ src: this.getCroppedUrl(), alt, ref: 'img', className: imageClassName })
        ),
        a({ href: '#', onClick: this.filePicker }, anchorTitle)
      )
    );
  }
});

module.exports = ImagePicker;
