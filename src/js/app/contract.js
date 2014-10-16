$(document).ready(function() {
  $(".contract a").each(function() {
    $(this).attr("target", "_blank");
    $(this).attr("href", "http://" + $(this).attr("href"));
  });
});
