InterExchange.DocumentSelect = function(element) {
  var $select = element.find('select'),
      $instructions = $('.document-instructions'),
      $target = $(element.data('target'));

  $select.on('change', function(event) {
    var document = currentDocument(event),
        instructions = "";

    if (document) {
      instructions = document.instructions;
    }

    $instructions.html(instructions);
    $target.toggleClass('is-instructions', instructions != "");
  });

  $select.on('change', function(event) {
    var document = currentDocument(event),
        isOtherDocument = (document === null);

    $target
      .toggleClass('is-other-document', isOtherDocument)
      .toggleClass('isnt-other-document', !isOtherDocument);
  });

  function currentDocument(event) {
    var documentName = event.val;

    if (documentName === "Other") {
      return null;
    }

    return InterExchange.DepartmentDocuments.filter(function(item) {
      return item.name == documentName;
    })[0];
  }
};
