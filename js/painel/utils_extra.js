bcr.onmessage = (ev) => {
  const data = ev.data;

  if (data.resend) {
    refreshData();
    sendFonts();
  } else {
    updateActiveInactiveTimes(data);
    checkSwitches();
  }
};

function updateActiveInactiveTimes(data) {
  for (let i = 1; i <= 4; i++) {
    const activeTime = data[`activeTime${i}_to_send`];
    const inactiveTime = data[`inactiveTime${i}_to_send`];
    const turnoff = data[`alt_${i}_turnoff`];

    window[`alt_${i}_active_time_monitor`] = activeTime;
    window[`alt_${i}_inactive_time_monitor`] = inactiveTime;
    window[`alt_${i}_turnoff`] = turnoff;

    const activeElem = document.getElementById(`alt-${i}-active-time-monitor`);
    const inactiveElem = document.getElementById(`alt-${i}-inactive-time-monitor`);
    if (activeElem) activeElem.innerHTML = activeTime;
    if (inactiveElem) inactiveElem.innerHTML = inactiveTime;

    if (turnoff && $(`#lower-thirds-switch${i}`).is(":checked")) {
      $(`#lower-thirds-switch${i}`).prop("checked", false).change();
    }
  }
}

function sendFonts() {
  fontlist_urls.forEach(font => bcf.postMessage({ new_font_to_send: font }));
}

function sendState() {
  // Função auxiliar para pegar valor com default
  const getValueOrDefault = (val, defaultVal) =>
    val === "" || val === undefined ? defaultVal : val;

  // Função auxiliar para checkbox checked boolean
  const isChecked = (id) => !!document.getElementById(id)?.checked;

  // Captura estado global
  const globalLockActive = isChecked("global-lock-active");
  const globalAnimationTime = getValueOrDefault($("#global-animation-time").val(), 4);
  const globalActiveTime = globalLockActive ? Infinity : getValueOrDefault($("#global-active-time").val(), 25);
  const globalInactiveTime = getValueOrDefault($("#global-inactive-time").val(), 420);
  const globalOneshot = isChecked("global-oneshot");

  // Armazena os estados alternates
  const alternates = [];

  for (let i = 1; i <= 4; i++) {
    const prefix = `alt-${i}`;

    const lockActive = isChecked(`${prefix}-lock-active`);

    // Nome, info, cores, tempos, etc
    const name = $(`#${prefix}-name`).val();
    const info = $(`#${prefix}-info`).val();
    const nameColor = $(`#${prefix}-name-color`).val();
    const infoColor = $(`#${prefix}-info-color`).val();

    // Estilos de cores - array 4 itens
    const styleColors = [];
    for (let c = 1; c <= 4; c++) {
      styleColors.push($(`#${prefix}-style-color-${c}`).val());
    }

    const animationTime = $(`#${prefix}-animation-time`).val();
    const activeTime = lockActive ? Infinity : $(`#${prefix}-active-time`).val();
    const inactiveTime = $(`#${prefix}-inactive-time`).val();
    const logoImage = $(`#${prefix}-logo-preview`).attr("src");

    // Switch mestre e individual
    const masterSwitchOn = document.getElementById("lower-thirds-masterswitch").checked;
    const individualSwitchChecked = document.getElementById(`lower-thirds-switch${i}`).checked;
    const altSwitch = masterSwitchOn && individualSwitchChecked ? "true" : "false";

    // Função auxiliar toggle por checkbox para logo, background, border, shadow
    function toggleByCheckbox(id, selectors = [], className = "disable") {
      const checked = isChecked(id);
      selectors.forEach(sel => {
        if (checked) $(sel).removeClass(className);
        else $(sel).addClass(className);
      });
      return checked ? "true" : "false";
    }

    // Atualiza opções booleanas e estilos
    const logoSwitch = toggleByCheckbox(`${prefix}-logo`, [
      `#${prefix}-logo-size`,
      `#${prefix}-config-content .logo-container`,
    ], "hide");

    const backgroundSwitch = toggleByCheckbox(`${prefix}-background`, [`#${prefix}-style-color-appearance`]);
    const borderSwitch = toggleByCheckbox(`${prefix}-border-color`, [
      `#${prefix}-border-thickness-amount`,
      `#${prefix}-style-border-color-appearance`,
    ]);
    const shadows = toggleByCheckbox(`${prefix}-shadows`, [`#${prefix}-shadow-amount`]);

    // Transform e Weight
    const nameTransform = document.getElementById(`${prefix}-name-transform`).checked ? "uppercase" : "normal";
    const nameWeight = document.getElementById(`${prefix}-name-weight`).checked ? "bold" : "lighter";

    // Outros estados que antes estavam no window
    const preview = document.getElementById(`${prefix}-preview`).checked ? "true" : "false";

    // Adiciona objeto alternate ao array
    alternates.push({
      id: i,
      switch: altSwitch,
      name,
      info,
      name_color: nameColor,
      info_color: infoColor,
      style_colors: styleColors,
      logo: {
        switch: logoSwitch,
        image: logoImage,
        // pode ter mais propriedades como size, se existir
        size: window[`${prefix}_logo_size`] || null,
      },
      background_switch: backgroundSwitch,
      border: {
        switch: borderSwitch,
        thickness: window[`${prefix}_border_thickness_amount`] || null,
      },
      shadows: {
        enabled: shadows,
        amount: window[`${prefix}_shadow_amount`] || null,
      },
      name_transform: nameTransform,
      name_weight: nameWeight,
      animation_time: animationTime || globalAnimationTime,
      active_time: activeTime,
      inactive_time: inactiveTime,
      preview,
      // outros campos do window, opcional
      // ...
    });
  }

  // Mostrar ou esconder os números dos slots
  const showSlotNumbers = !isChecked("set-slot-numbers");
  $(".slot-number").toggleClass("hide", !showSlotNumbers);

  // Atualiza tooltips
  updateTooltips();

  // Atualiza posição do switch
  const switchLeft = isChecked("set-switch-position");
  [".switch", ".drag-handle", ".main-title"].forEach(sel => {
    $(sel).toggleClass("switch-left", switchLeft);
  });

  // Sincroniza checkboxes gêmeas
  $(".twin-checkbox").each(function () {
    const name = $(this).attr("name");
    $(`input[type=checkbox][name=${name}]`).on("click", function () {
      $(`input[type=checkbox][name=${name}]`).prop("checked", this.checked);
    });
  });

  // Envia dados para backend ou worker
  bc.postMessage({
    global: {
      animation_time: globalAnimationTime,
      active_time: globalActiveTime,
      inactive_time: globalInactiveTime,
      oneshot: globalOneshot,
    },
    alternates,
  });

  // Você pode adicionar console.log(alternates) para debug se quiser
}

function updateTooltips() {
  if (document.getElementById("set-tooltips").checked) {
    $(".panel-bottom > ul > li").each(function () {
      const $this = $(this);
      const name = $this.children(".stored-name").text();
      const info = $this.children(".stored-info").text();
      const hasTooltip = $this.children(".tooltiptext").length > 0;
      const isStored = name && info;

      if (hasTooltip && !isStored) {
        $this.children(".tooltiptext").remove();
      } else if (!hasTooltip && isStored) {
        $this.prepend(
          `<span class="tooltiptext">${name}<br>${info}<hr><p>Click and hold to delete.</p></span>`
        );
      }
    });
  } else {
    $(".tooltiptext").remove();
  }
}
