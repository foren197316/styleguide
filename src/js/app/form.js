$(document).ready(function() {
  $("form").on("submit", function(event) {
    $(event.target).find(":submit").attr("disabled", "disabled");
  });
});
