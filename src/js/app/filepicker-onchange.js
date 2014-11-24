InterExchange.FilePickerOnChange = function(element) {
  var $filePicker = element.find('[type="filepicker"]'),
      $fileName = element.find('.filename'),
      $linksLabel = element.find('label.links'),
      $removeLink = element.find('a.fileremove');

  $filePicker.on('change', function(event) {
    var file = event.originalEvent.fpfiles[0],
        url = file.url,
        fileName = file.filename,
        $linkUrl = $('<a class="fileurl"/>').attr('href', url).html(fileName),
        $linkRemove = $('<a href="#" class="fileremove">remove</a>');

    $linksLabel.empty().append($linkUrl).append($linkRemove);

    $fileName.val(fileName);

    $(document).trigger('remonitor');
  });

  element.on("click", "a.fileremove", function() {
    $fileName.val('');
    $filePicker.val('');
    $linksLabel.empty();
  });
};
