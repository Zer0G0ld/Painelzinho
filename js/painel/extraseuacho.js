
bcr.onmessage = function (ev) {
  const data = ev.data;

  if (data.resend) {
    refreshData();
    function_send_font();
  } else {
    for (let i = 1; i <= 4; i++) {
      // Atualiza as variáveis de tempo ativo/inativo globais
      window[`alt_${i}_active_time_monitor`] = data[`activeTime${i}_to_send`];
      window[`alt_${i}_inactive_time_monitor`] =
        data[`inactiveTime${i}_to_send`];

      // Atualiza os elementos HTML correspondentes
      document.getElementById(`alt-${i}-active-time-monitor`).innerHTML =
        window[`alt_${i}_active_time_monitor`];
      document.getElementById(`alt-${i}-inactive-time-monitor`).innerHTML =
        window[`alt_${i}_inactive_time_monitor`];

      // Atualiza variáveis de desligamento
      window[`alt_${i}_turnoff`] = data[`alt_${i}_turnoff`];

      // Verifica e atualiza o switch se estiver ligado mas a variável turnoff estiver true
      if (
        window[`alt_${i}_turnoff`] &&
        $(`#lower-thirds-switch${i}`).is(":checked")
      ) {
        $(`#lower-thirds-switch${i}`).prop("checked", false).change();
      }
    }

    checkSwitches();
  }
};

//////////////////////////////////////
function function_send() {
  // Usar um objeto para armazenar o estado ao invés de jogar tudo no `window`
  const lowerThirdsState = {};

  // Switch Lock Active Mode ALT ON/OFF
  lowerThirdsState.global_lock_active =
    !!document.getElementById("global-lock-active").checked;

  for (let i = 1; i <= 4; i++) {
    lowerThirdsState[`alt_${i}_lock_active`] = !!document.getElementById(
      `alt-${i}-lock-active`
    ).checked;
  }

  //////////////////////////////

  // Função auxiliar para pegar valor ou padrão
  const getValueOrDefault = (val, defaultVal) =>
    val === "" || val === undefined ? defaultVal : val;

  lowerThirdsState.global_animation_time = getValueOrDefault(
    $("#global-animation-time").val(),
    4
  );
  lowerThirdsState.global_active_time = lowerThirdsState.global_lock_active
    ? Infinity
    : getValueOrDefault($("#global-active-time").val(), 25);
  lowerThirdsState.global_inactive_time = getValueOrDefault(
    $("#global-inactive-time").val(),
    420
  );

  for (let i = 1; i <= 4; i++) {
    lowerThirdsState[`alt_${i}_name`] = $(`#alt-${i}-name`).val();
    lowerThirdsState[`alt_${i}_info`] = $(`#alt-${i}-info`).val();

    lowerThirdsState[`alt_${i}_name_color`] = $(`#alt-${i}-name-color`).val();
    lowerThirdsState[`alt_${i}_info_color`] = $(`#alt-${i}-info-color`).val();

    // Cores do estilo em array
    lowerThirdsState[`alt_${i}_style_colors`] = [];
    for (let c = 1; c <= 4; c++) {
      lowerThirdsState[`alt_${i}_style_colors`].push(
        $(`#alt-${i}-style-color-${c}`).val()
      );
    }

    lowerThirdsState[`alt_${i}_animation_time`] = $(
      `#alt-${i}-animation-time`
    ).val();

    lowerThirdsState[`alt_${i}_active_time`] = lowerThirdsState[
      `alt_${i}_lock_active`
    ]
      ? Infinity
      : $(`#alt-${i}-active-time`).val();

    lowerThirdsState[`alt_${i}_inactive_time`] = $(
      `#alt-${i}-inactive-time`
    ).val();
    lowerThirdsState[`alt_${i}_logo_image`] = $(`#alt-${i}-logo-preview`).attr(
      "src"
    );
  }

  // Check Master Switch
  const masterSwitchIsOn = document.getElementById(
    "lower-thirds-masterswitch"
  ).checked;

  // Atualiza os switches individuais com base no estado do masterSwitch
  for (let i = 1; i <= 4; i++) {
    const switchChecked =
      masterSwitchIsOn &&
      document.getElementById(`lower-thirds-switch${i}`).checked;
    lowerThirdsState[`alt_${i}_switch`] = switchChecked ? "true" : "false";
  }

  // Define os tempos de espera, usando o tempo da animação específica ou o global
  for (let i = 1; i <= 4; i++) {
    lowerThirdsState[`alt_${i}_waiting_time`] =
      lowerThirdsState[`alt_${i}_animation_time`] ||
      lowerThirdsState.global_animation_time;
  }

  // Agora você tem tudo no objeto `lowerThirdsState`, que é fácil de gerenciar e depurar
  console.log(lowerThirdsState);

  //////////////////////////////

  // Função auxiliar para pegar boolean de checkbox
  const getChecked = (id) => !!document.getElementById(id)?.checked;

  // Objetos para armazenar os estados
  const autoload = {};
  const autotrigger = {};
  const oneshot = {};

  // Preencher os objetos para ALT 1 a 4
  for (let i = 1; i <= 4; i++) {
    autoload[`alt_${i}_autoload`] = getChecked(`alt-${i}-autoload`);
    autotrigger[`alt_${i}_autotrigger`] = getChecked(`alt-${i}-autotrigger`);
    oneshot[`alt_${i}_oneshot`] = getChecked(`alt-${i}-oneshot`);
  }

  // Global oneshot
  oneshot.global_oneshot = getChecked("global-oneshot");

  // Exemplo: para acessar use autoload.alt_1_autoload, etc.
  // console.log(autoload, autotrigger, oneshot);

  // Mostrar ou esconder os números dos slots
  const showSlotNumbers = !getChecked("set-slot-numbers");

  $(".slot-number").each(function () {
    if (showSlotNumbers) {
      $(this).removeClass("hide");
    } else {
      $(this).addClass("hide");
    }
  });

  //////////////////////////////

  function toggleByCheckbox(
    id,
    toggleTargetSelectors = [],
    className = "disable"
  ) {
    const isChecked = document.getElementById(id).checked;
    toggleTargetSelectors.forEach((selector) => {
      if (isChecked) {
        $(selector).removeClass(className);
      } else {
        $(selector).addClass(className);
      }
    });
    return isChecked ? "true" : "false";
  }

  function updateTooltips() {
    if (document.getElementById("set-tooltips").checked) {
      $(".panel-bottom > ul > li").each(function () {
        const name = $(this).children(".stored-name").text();
        const info = $(this).children(".stored-info").text();
        const isStored = name && info;
        const hasTooltip = $(this).children(".tooltiptext").length > 0;

        if (hasTooltip && !isStored) {
          $(this).children(".tooltiptext").remove();
        } else if (!hasTooltip && isStored) {
          $(this).prepend(
            `<span class="tooltiptext">${name}<br>${info}<hr><p>Click and hold to delete.</p></span>`
          );
        }
      });
    } else {
      $(".tooltiptext").remove();
    }
  }

  function updateAltSections(prefix, options = {}) {
    const { logo, background, border, shadow, transform, weight } = options;

    if (logo) {
      window[`${prefix}_logo_switch`] = toggleByCheckbox(
        `${prefix}-logo`,
        [`#${prefix}-logo-size`, `#${prefix}-config-content .logo-container`],
        "hide"
      );
    }

    if (background) {
      window[`${prefix}_background_switch`] = toggleByCheckbox(
        `${prefix}-background`,
        [`#${prefix}-style-color-appearance`]
      );
    }

    if (border) {
      window[`${prefix}_border_switch`] = toggleByCheckbox(
        `${prefix}-border-color`,
        [
          `#${prefix}-border-thickness-amount`,
          `#${prefix}-style-border-color-appearance`,
        ]
      );
    }

    if (shadow) {
      window[`${prefix}_shadows`] = toggleByCheckbox(`${prefix}-shadows`, [
        `#${prefix}-shadow-amount`,
      ]);
    }

    if (transform !== undefined) {
      window[`${prefix}_name_transform`] = document.getElementById(
        `${prefix}-name-transform`
      ).checked
        ? "uppercase"
        : "normal";
    }

    if (weight !== undefined) {
      window[`${prefix}_name_weight`] = document.getElementById(
        `${prefix}-name-weight`
      ).checked
        ? "bold"
        : "lighter";
    }
  }

  updateTooltips();

  ["alt-1", "alt-2", "alt-3", "alt-4"].forEach((prefix) => {
    updateAltSections(prefix, {
      logo: true,
      background: true,
      border: true,
      shadow: true,
      transform: true,
      weight: true,
    });
  });

  // Preview geral
  $("#alt-preview, .preview-btn").toggleClass(
    "hide",
    !document.getElementById("set-preview").checked
  );

  // Alt individual previews
  ["alt-1", "alt-2", "alt-3", "alt-4"].forEach((id) => {
    window[`${id}_preview`] = document.getElementById(`${id}-preview`).checked
      ? "true"
      : "false";
  });

  // Switch posição
  const isSwitchLeft = document.getElementById("set-switch-position").checked;
  [".switch", ".drag-handle", ".main-title"].forEach((sel) => {
    $(sel).toggleClass("switch-left", isSwitchLeft);
  });

  $(".twin-checkbox").each(function () {
    const twinName = $(this).attr("name");
    $(`input[type=checkbox][name=${twinName}]`).on("click", function () {
      $(`input[type=checkbox][name=${twinName}]`).prop("checked", this.checked);
    });
  });
  const globalSettings = {
    animation_time: global_animation_time,
    active_time: global_active_time,
    inactive_time: global_inactive_time,
    oneshot: global_oneshot,
  };

  const alternates = [1, 2, 3, 4].map((n) => ({
    id: n,
    switch: window[`alt_${n}_switch`],
    style: window[`alt_${n}_style`],
    name: window[`alt_${n}_name`],
    info: window[`alt_${n}_info`],
    name_size: window[`alt_${n}_name_size`],
    info_size: window[`alt_${n}_info_size`],
    name_transform: window[`alt_${n}_name_transform`],
    info_transform: window[`alt_${n}_info_transform`],
    name_weight: window[`alt_${n}_name_weight`],
    info_weight: window[`alt_${n}_info_weight`],
    name_color: window[`alt_${n}_name_color`],
    info_color: window[`alt_${n}_info_color`],
    style_colors: [
      window[`alt_${n}_style_color_1`],
      window[`alt_${n}_style_color_2`],
      window[`alt_${n}_style_color_3`],
      window[`alt_${n}_style_color_4`],
    ],
    logo: {
      switch: window[`alt_${n}_logo_switch`],
      image: window[`alt_${n}_logo_image`],
      size: window[`alt_${n}_logo_size`],
    },
    background_switch: window[`alt_${n}_background_switch`],
    border: {
      switch: window[`alt_${n}_border_switch`],
      thickness: window[`alt_${n}_border_thickness_amount`],
    },
    shadows: {
      enabled: window[`alt_${n}_shadows`],
      amount: window[`alt_${n}_shadow_amount`],
    },
    align: window[`alt_${n}_align`],
    size: window[`alt_${n}_size`],
    margin: {
      h: window[`alt_${n}_margin_h`],
      v: window[`alt_${n}_margin_v`],
    },
    line_spacing: window[`alt_${n}_line_spacing`],
    font: window[`alt_${n}_font`],
    animation_time: window[`alt_${n}_animation_time`],
    active_time: window[`alt_${n}_active_time`],
    inactive_time: window[`alt_${n}_inactive_time`],
    oneshot: window[`alt_${n}_oneshot`],
    corners: window[`alt_${n}_corners`],
    preview: window[`alt_${n}_preview`],
  }));

  bc.postMessage({
    global: globalSettings,
    alternates,
  });
}

function function_send_font() {
  fontlist_urls.forEach((font) => {
    bcf.postMessage({ new_font_to_send: font });
  });
}

document.getElementById("importFile").onchange = function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    localStorage.clear();
    writeLocalStorage(e.target.result);
  };

  reader.readAsText(file);
};

function openTab(element, cityName) {
  document.querySelectorAll(".tabcontent").forEach((tab) => {
    tab.style.display = "none";
  });

  document.querySelectorAll(".tablinks").forEach((link) => {
    link.classList.remove("active");
  });

  document.getElementById(`tab-${cityName}`).style.display = "block";
  element.classList.add("active");

  updateMoreMaxHeight();
}

function settingsTooltips() {
  const tooltip = {
    global_animation_time: "Length of the in and out animation.<br>Default: 4 sec.",
    global_active_time: "How long the LT is active.<br>Default: 25 sec.",
    global_inactive_time: "How long the LT is inactive.<br>Default: 420 sec.",
    lock_active: "Lock the active state: Always active.",
    oneshot: "Oneshot: Turns off the LT Switch when it goes into inactive state.",
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
    autotrigger: "Autotrigger: Turns on the switch automatically when a slot memory is loaded.",
    autoload: "Autoload: Loads automatically the next memory slot every time it goes to the inactive state. Ready to display in the next cycle.",
    custom_times: "Show/hide custom time settings.",
    animation_time: "Length of the in and out animation.",
    active_time: "How long the LT is active.",
    inactive_time: "How long the LT is inactive.",
    preview_window: "Show/hide preview window.",
    custom_fonts: "Add fonts from Google Fonts.",
    default_logos: "Change the default logos of each LT.<br>Make sure to copy the logo files into the logos folder.<br>You can use JPG, PNG, TIFF, GIF, etc.<br>With transparency or animated.",
  };

  const slots = ["alt-1", "alt-2", "alt-3", "alt-4"];

  const setTooltip = (selector, key, traversal = null) => {
    let el = $(selector);
    if (traversal === "parent") el = el.parent();
    else if (traversal === "parent2") el = el.parent().parent();
    else if (traversal === "next") el = el.next();
    el.attr("title", tooltip[key]);
  };

  // Global tooltips
  setTooltip("#global-animation-time", "global_animation_time");
  setTooltip("#global-active-time", "global_active_time");
  setTooltip("#global-inactive-time", "global_inactive_time");

  // Tooltip para slots dinâmicos
  slots.forEach((slot) => {
    setTooltip(`#${slot}-animation-time`, "animation_time");
    setTooltip(`#${slot}-active-time`, "active_time");
    setTooltip(`#${slot}-inactive-time`, "inactive_time");
    setTooltip(`#${slot}-lock-active`, "lock_active", "parent");
    setTooltip(`#${slot}-oneshot`, "oneshot", "parent");
    setTooltip(`#${slot}-preview`, "preview", "parent");
    setTooltip(`#${slot}-align-left`, "align_left", "next");
    setTooltip(`#${slot}-align-center`, "align_center", "next");
    setTooltip(`#${slot}-align-right`, "align_right", "next");
    setTooltip(`#${slot}-style`, "style", "parent2");
    setTooltip(`#${slot}-size`, "size", "parent2");
    setTooltip(`#${slot}-margin-h`, "margin", "parent2");
    setTooltip(`#${slot}-inverse-ratio`, "text_size", "parent2");
    setTooltip(`#${slot}-line-spacing`, "line_spacing", "parent2");
    setTooltip(`#${slot}-font`, "font", "parent");
    setTooltip(`#${slot}-logo`, "logo", "parent");
    setTooltip(`#${slot}-logo-size`, "logo_size", "parent");
    setTooltip(`#${slot}-shadows`, "shadow", "parent");
    setTooltip(`#${slot}-shadow-amount`, "shadow_opacity", "parent");
    setTooltip(`#${slot}-background`, "fill_colors", "parent");
    setTooltip(`#${slot}-corners`, "corners", "parent2");
    setTooltip(`#${slot}-border-thickness`, "borders", "parent");
    setTooltip(`#${slot}-border-color`, "borders", "parent");
    setTooltip(`#${slot}-border-thickness-amount`, "borders_thinkness", "parent");
    setTooltip(`#${slot}-clean-inputs`, "clean");
    setTooltip(`#${slot}-autotrigger`, "autotrigger", "parent");
    setTooltip(`#${slot}-autoload`, "autoload", "parent");
    setTooltip(`#${slot}-custom-times`, "custom_times");
  });

  // Outros tooltips
  setTooltip("#fonts-options > :first-child", "custom_fonts");
  setTooltip(".logos-options > :first-child", "default_logos");
  setTooltip("#toggle-preview", "preview_window");

  // Inicializar jQuery UI Tooltip
  $(document).tooltip({
    show: { delay: 600, duration: 200 },
    content: function () {
      return $(this).attr("title");
    },
    open: function (event, ui) {
      ui.tooltip.hover(function () {
        $(this).fadeTo("slow", 0.2);
      });
    },
  });
}

//Read all localstorage data
function getLocalStorage() {
  var a = {};
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    var v = localStorage.getItem(k);
    a[k] = v;
  }
  var s = JSON.stringify(a);
  return s;
}

//Save data to localStorage
function writeLocalStorage(data) {
  var o = JSON.parse(data);
  for (var property in o) {
    if (o.hasOwnProperty(property)) {
      localStorage.setItem(property, o[property]);
    }
  }
  location.reload();
}

//Copy all data to clipboard
function exportData() {
  var allData = getLocalStorage();
  document.getElementById("dataInput").value = allData;
  var copyText = document.getElementById("dataInput");

  //Open the Popup "Copied to Clipboard"
  openExportPopup();

  //Select text input and copy to the clipboard
  copyText.select();
  document.execCommand("copy");
}

function loadData() {
  $(".storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);
    var default_value = $(this).attr("value");

    if (value) {
      $(this).val(value);
    } else if (default_value) {
      $(this).val(default_value);
    }
  });

  $(".logo-storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);
    if (value != "undefined" && value != "") {
      $(this).attr("src", value);
    } else {
      //Set all to default the first time
      if (id == "alt-1-logo-preview" || id == "alt-1-logo-default") {
        $(this).attr("src", alt_1_logo_default);
      }
      if (id == "alt-2-logo-preview" || id == "alt-2-logo-default") {
        $(this).attr("src", alt_2_logo_default);
      }
      if (id == "alt-3-logo-preview" || id == "alt-3-logo-default") {
        $(this).attr("src", alt_3_logo_default);
      }
      if (id == "alt-4-logo-preview" || id == "alt-4-logo-default") {
        $(this).attr("src", alt_4_logo_default);
      }
    }
  });

  $(".slot-storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);

    $(this).text(value);
  });

  $(".checkbox-storable, .radio-storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);

    if (value) {
      $(this).prop("checked", localStorage.getItem(id) === "true");
    }
  });

  $(".title-storable").each(function () {
    var id = $(this).attr("id");
    var value = localStorage.getItem(id);

    if (value) {
      $(this).text(value);
    }
  });
}

function saveData() {
  // If local storage is empty, call reset to reinitialize
  if (localStorage.length === 0) {
    okResetPopup();
  }

  $(".storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    var value = $(this).val();
    localStorage.setItem(id, value);
  });

  // Update while input (text or number) is changed
  $(":input[type=text], :input[type=number]").on("input", function (e) {
    refreshData();
    var id = $(this).attr("id");
    var value = $(this).val();
    localStorage.setItem(id, value);
  });

  $(".logo-storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    var value = $(this).attr("src");
    localStorage.setItem(id, value);
  });

  $(".slot-storable, .title-storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    var value = $(this).text();
    localStorage.setItem(id, value);
  });

  $(".checkbox-storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    localStorage.setItem(id, $(this).is(":checked"));

    // Check for a twin chekcbox
    if ($(this).hasClass("twin-checkbox")) {
      const twin = $(this)
        .parents(".grid-row")
        .find(".twin-checkbox")
        .not(this);
      id = twin.attr("id");
      localStorage.setItem(id, twin.is(":checked"));
    }
  });

  $(".radio-storable").change(function () {
    refreshData();
    var radio_name = $(this).attr("name");
    $(":input[name=" + radio_name + "]").each(function () {
      var id = $(this).attr("id");
      localStorage.setItem(id, $(this).is(":checked"));
    });
  });

  $(".font-storable, .select-settings-storable").change(function () {
    refreshData();
    var id = $(this).attr("id");
    localStorage.setItem(id, this.value);
  });

  /**
   * Indirect changes
   */
  $(":button").on("click", function (e) {
    // Lanza evento de cambio del input superior
    $(this).parent().find("input").change();
  });

  $(".slot-number").on("click", function (e) {
    // Lanza evento de cambio de los divs hermanos
    $(this).siblings(".slot-storable").change();
  });
}

function refreshData() {
  console.log("refreshData");
  checkLogos();
  checkSlots(
    "#alt-1-memory-slots",
    "#alt-1-name",
    "#alt-1-info",
    "#alt-1-logo-preview"
  );
  checkSlots(
    "#alt-2-memory-slots",
    "#alt-2-name",
    "#alt-2-info",
    "#alt-2-logo-preview"
  );
  checkSlots(
    "#alt-3-memory-slots",
    "#alt-3-name",
    "#alt-3-info",
    "#alt-3-logo-preview"
  );
  checkSlots(
    "#alt-4-memory-slots",
    "#alt-4-name",
    "#alt-4-info",
    "#alt-4-logo-preview"
  );
  getAppearance();
  checkSwitches();
  function_send();
}

function checkUpdates() {
  checkHotkeys();
  updateHotkeys();
}

settingsTooltips();
loadDefaultValues();
loadData();
updateCustomFontList();
refreshData();
checkSwitches();
saveData();
setInterval(() => checkUpdates(), 200);

// Wait document to be ready to do some stuff
$(document).ready(function () {
  $("#defaultTab").click();
});
