'use strict';
require('../main');
let React = require('react/addons');
let rootNode = require('../root-node');
let ParticipantBanner = React.createFactory(require('../components/ParticipantBanner'));
let { participant } = global.INITIAL_DATA;

React.render(ParticipantBanner({ participant }), rootNode);
