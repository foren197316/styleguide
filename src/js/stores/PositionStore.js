'use strict';



var PositionStore = Reflux.createStore({
  resourceName: 'positions',
  listenables: PositionActions
});

module.exports = PositionStore;
