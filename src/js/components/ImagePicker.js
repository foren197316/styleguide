'use strict';
let React = require('react/addons');
let filepicker = global.filepicker;
let { a, img } = React.DOM;

let ImagePicker = React.createClass({
  displayName: 'ImagePicker',

  propTypes: {
    alt: React.PropTypes.string,
    anchorTitle: React.PropTypes.string,
    imageClassName: React.PropTypes.string,
    src: React.PropTypes.string,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
  },

  getDefaultProps () {
    return {
      width: 150,
      height: 150,
    };
  },

  filePicker () {
    filepicker.pick(
      {
        debug: global.FILEPICKER_DEBUG
      },
      Blob => {
        this.refs.img.getDOMNode().src = this.getCroppedUrl(Blob.url);
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
    let { alt, anchorTitle, imageClassName, src } = this.props;

    return (
      a({ href:'#', title: anchorTitle, onClick: this.filePicker, style: { 'display': 'block' } },
        img({ src: this.getCroppedUrl(src), alt, ref: 'img', className: imageClassName })
      )
    );
  }
});

module.exports = ImagePicker;
