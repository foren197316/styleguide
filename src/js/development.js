function Intercom(action, name, data) {
  console.log("Intercom", action, name, data);
}

var ReportStore = Reflux.createStore({
  history: [],

  init: function () {
    for (var i in window) {
      if (/Store$/.test(i) && i !== "ReportStore") {
        window[i].listen(this.report.bind(this, i));
      }
    }
  },

  report: function (storeName, data) {
    this.history.push({
      storeName: storeName,
      data: data,
      time: new Date().toString()
    })
  }
});
