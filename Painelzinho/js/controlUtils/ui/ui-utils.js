//Send New Fonts to source
function function_send_font() {
  $.each(fontlist_urls, function (i) {
    new_font_to_send = fontlist_urls[i];
    bcf.postMessage({ new_font_to_send });
  });
}

//Read txt file and call writeLocalStorage function
document.getElementById("importFile").onchange = function () {
  var file = this.files[0];
  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    localStorage.clear();

    writeLocalStorage(this.result);
  };
  reader.readAsText(file);
};

function openTab(element, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  // Remove a classe 'active' de todas as tabs
  Array.from(document.getElementsByClassName("tabcontent")).forEach((tab) =>
    tab.classList.remove("active")
  );

  // Adiciona a classe 'active' na tab atual
  document.getElementById("tab-" + cityName).classList.add("active");

  element.className += " active";
  updateMoreMaxHeight();
}

function settingsTooltips() {
  const tooltip = {
    global_animation_time:
      "Length of the in and out animation.<br>Default: 4 sec.",
    global_active_time: "How long the LT is active.<br>Default: 25 sec.",
    global_inactive_time: "How long the LT is inactive.<br>Default: 420 sec.",
    lock_active: "Lock the active state: Always active.",
    oneshot:
      "Oneshot: Turns off the LT Switch when it goes into inactive state.",
    preview: "Show/hide the LT in the preview window",
    align_left: "Left alignment.",
    align_center: "Center alignment.",
    align_right: "Right alignment.",
    style: "Style: Changes the look of the LT.",
    size: "Size of the LT.",
    margin: "Horizontal and vertical margin.",
    text_size: "Ratio between the size of the texts.",
    line_spacing: "Space between texts.",
    font: "LT Text font.",
    logo: "Show/hide the logo image.",
    logo_size: "Size of the logo image.",
    shadow: "Show/hide shadows.",
    shadow_opacity: "Shadows opacity.",
    fill_colors: "Enable/disable fill or background colors.",
    corners: "Round corners.",
    borders: "Enable/disable borders.",
    borders_thinkness: "Border thickness.",
    uppercase: "Enable/disable uppercase.",
    bold: "Enable/disable bold.",
    clean: "Clear the text fields and set the logo to default.",
    autotrigger:
      "Autotrigger: Turns on the switch automatically when a slot memory is loaded.",
    autoload:
      "Autoload: Loads automatically the next memory slot every time it goes to the inactive state. Ready to display in the next cycle.",
    custom_times: "Show/hide custom time settings.",
    animation_time: "Length of the in and out animation.",
    active_time: "How long the LT is active.",
    inactive_time: "How long the LT is inactive.",
    preview_window: "Show/hide preview window.",
    custom_fonts: "Add fonts from Google Fonts.",
    default_logos:
      "Change the default logos of each LT.<br>Make sure to copy the logo files into the logos folder.<br>You can use JPG, PNG, TIFF, GIF, etc.<br>With transparency or animated.",
  };

  // Globals
  [
    "global-animation-time",
    "global-active-time",
    "global-inactive-time",
  ].forEach((id) => {
    $(`#${id}`).attr("title", tooltip[id.replace(/-/g, "_")]);
  });

  // ALT slots 1–4
  for (let i = 1; i <= 4; i++) {
    const prefix = `#alt-${i}-`;

    const singleSelectors = {
      "animation-time": "animation_time",
      "active-time": "active_time",
      "inactive-time": "inactive_time",
      preview: "preview",
      font: "font",
      logo: "logo",
      "logo-size": "logo_size",
      shadows: "shadow",
      "shadow-amount": "shadow_opacity",
      background: "fill_colors",
      corners: "corners",
      "border-thickness-amount": "borders_thinkness",
      "clean-inputs": "clean",
      autotrigger: "autotrigger",
      autoload: "autoload",
      "custom-times": "custom_times",
    };

    Object.entries(singleSelectors).forEach(([sel, tip]) => {
      $(`${prefix}${sel}`).parent().attr("title", tooltip[tip]);
    });

    // Alignment radios
    ["left", "center", "right"].forEach((pos) => {
      $(`${prefix}align-${pos}`).next().attr("title", tooltip[`align_${pos}`]);
    });

    // Style, size, margin, line spacing
    ["style", "size", "margin-h", "inverse-ratio", "line-spacing"].forEach(
      (sel) => {
        $(`${prefix}${sel}`).parent().parent().attr(
          "title",
          tooltip[
            {
              style: "style",
              size: "size",
              "margin-h": "margin",
              "inverse-ratio": "text_size",
              "line-spacing": "line_spacing",
            }[sel]
          ]
        );
      }
    );

    // Borders checkbox
    ["border-color", "border-thickness"].forEach((sel) => {
      $(`${prefix}${sel}`).parent().attr("title", tooltip.borders);
    });
  }

  // Extra tooltips
  $("#fonts-options").children().first().attr("title", tooltip.custom_fonts);
  $(".logos-options").children().first().attr("title", tooltip.default_logos);
  $("#toggle-preview").attr("title", tooltip.preview_window);

  // Initialize jQuery UI tooltip
  $(document).tooltip({
    show: { delay: 600, duration: 200 },
    open: function (event, ui) {
      ui.tooltip.hover(() => $(this).fadeTo("slow", 0.2));
    },
    content: function () {
      return $(this).attr("title");
    },
  });
}

export { settingsTooltips, function_send_font, openTab };
