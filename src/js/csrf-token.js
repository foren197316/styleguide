'use strict';
let meta = global.document.querySelector('meta[name="csrf-token"]');
module.exports = meta ? meta.getAttribute('content') : '';
