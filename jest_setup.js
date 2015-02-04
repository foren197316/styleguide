btoa = function (string) {
  return new Buffer(string).toString('base64');
};

atob = function (base64) {
  return new Buffer(base64, 'base64').toString();
};
