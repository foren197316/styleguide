document.fonts.load('1em Founders Grotesk Web')
  .then(function() {
    var docEl = document.documentElement;
    docEl.className += ' fonts-loaded';
  });
