'use strict';
module.exports = global.document.querySelector('meta[name="csrf-token"]').getAttribute('content');
