// preview.js
function togglePreview() {
  $("#toggle-preview").click(function() {
    $(this).toggleClass("active");
    $("#alt-preview").toggleClass("active");
    const panel = $("#alt-panel");
    panel.css("marginBottom", panel.css("marginBottom") === "0px" ? "220px" : "0px");
  });
}

export { togglePreview };