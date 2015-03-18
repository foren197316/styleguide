'use strict';
if (process.env.__ENV__ === 'test') {
  module.exports = 'lol';
} else {
  module.exports = global.document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}
