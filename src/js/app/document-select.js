InterExchange.DocumentSelect = function(element) {
  var $select = element.find('select'),
      $instructions = $('.document-instructions'),
      $target = $(element.data('target'));

  $select.on('change', function(event) {
    var document = currentDocument(this.value),
        instructions = "";

    if (document) {
      instructions = document.instructions;
    }

    $instructions.html(instructions);
    $target.toggleClass('is-instructions', instructions != "");
  });

  $select.on('change', function(event) {
    var document = currentDocument(this.value),
        isOtherDocument = (document === null);

    $target
      .toggleClass('is-other-document', isOtherDocument)
      .toggleClass('isnt-other-document', !isOtherDocument);
  });

  function currentDocument(documentName) {
    if (documentName === "Other") {
      return null;
    }

    return InterExchange.DepartmentDocuments.filter(function(item) {
      return item.name == documentName;
    })[0];
  }
};
