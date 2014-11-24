InterExchange.FilePickerRemove = function(element) {
  var $removelink = element.find('a.fileremove');

  $removelink.on('click', function() {
    var $filename = element.find('input.filename');
    $filename.val(null);
  });

  $removelink.on('click', function() {
    var $filepicker = element.find('input[type="filepicker"]');
    $filepicker.val(null);
  });

  $removelink.on('click', function() {
    var $linkslabel = element.find('label.links');
    $linkslabel.empty();
  });
};
