'use strict';
let React = require('react/addons');
let filepicker = global.filepicker;
let { a, img } = React.DOM;
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
            this.refs.img.getDOMNode().src = this.getCroppedUrl(Blob.url);
          }, () => {
            global.location = global.location;
          });
      }
    );
  },

  getCroppedUrl (url) {
    let { width, height } = this.props;
    if (!width || !height) {
      return url;
    }

    return `${url}/convert?w=${width}&h=${height}&fit=crop`;
  },

  render () {
    let { alt, anchorTitle, imageClassName, url } = this.props;

    return (
      a({ href:'#', title: anchorTitle, onClick: this.filePicker, style: { 'display': 'block' } },
        img({ src: this.getCroppedUrl(url), alt, ref: 'img', className: imageClassName })
      )
    );
  }
});

module.exports = ImagePicker;
