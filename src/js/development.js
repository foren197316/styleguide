function Intercom(action, name, data) {
  console.log("Intercom", action, name, data);
}

/**
 * Uncomment ReportStore for a console debug message extravaganza.
 * Reports every time a store emits data.
 */
/*
var ReportStore = Reflux.createStore({
  init: function () {
    for (var i in window) {
      if (/Store$/.test(i) && i !== "ReportStore") {
        window[i].listen(this.report.bind(this, i));
      }
    }
  },

  report: function (storeName, data) {
    console.log("Data emitted from " + storeName, data);
  }
});
*/
