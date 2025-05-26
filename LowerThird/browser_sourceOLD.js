

// Arrays para controle dos slots
const alt_active_time = [10, 12, 8, 15];
const alt_inactive_time = [5, 5, 5, 5];
const alt_oneshot = [false, true, false, false];
const alt_turnoff = [false, false, false, false];

const c = [0, 0, 0, 0]; // contador ativo
const d = [0, 0, 0, 0]; // contador inativo
const t = [null, null, null, null]; // timeout ativo
const s = [null, null, null, null]; // timeout inativo
const activeIsOn = [false, false, false, false];
const inactiveIsOn = [false, false, false, false];

// Funções auxiliares para animação (mantém o que você já tem)

// Resetar estado do slot
function resetSlot(i) {
  if (i < 0 || i > 3) return;

  c[i] = d[i] = 0;
  t[i] = s[i] = null;
  activeIsOn[i] = inactiveIsOn[i] = alt_turnoff[i] = false;
}

// Timer genérico
function startTimer(i, counter, timeoutRef, limit, onComplete) {
  if (i === -1) return;
  if (counter[i] <= limit[i]) {
    counter[i]++;
    timeoutRef[i] = setTimeout(
      () => startTimer(i, counter, timeoutRef, limit, onComplete),
      1000
    );
  } else if (onComplete) {
    onComplete(i);
  }
}

// Encapsulamento dos contadores
function activeCount(id) {
  const i = getIndexFromId(id);
  startTimer(i, c, t, alt_active_time, () => {
    stopTimeCount(id);
    startInactiveCount(id);
  });
}

function inactiveCount(id) {
  const i = getIndexFromId(id);
  startTimer(i, d, s, alt_inactive_time, () => {
    d[i] = 0;
    clearTimeout(s[i]);
    inactiveIsOn[i] = false;
    startActiveCount(id);
  });
}

// Iniciar ativo
function startActiveCount(id) {
  const i = getIndexFromId(id);
  if (i === -1 || activeIsOn[i]) return;

  activeIsOn[i] = true;
  activeCount(id);
  animationIn(id);
}

// Iniciar inativo
function startInactiveCount(id) {
  const i = getIndexFromId(id);
  if (i === -1 || inactiveIsOn[i]) return;

  inactiveIsOn[i] = true;
  if (alt_oneshot[i]) {
    alt_turnoff[i] = true;
  } else {
    inactiveCount(id);
  }
  animationOut(id);
}

// Parar tudo e resetar
function stopTimeCount(id) {
  const i = getIndexFromId(id);
  if (i === -1) return;

  resetSlot(i);
  animationOut(id);
}

bcp.onmessage = function (ev) {
  const received_data = ev.data;
  const { global_animation_time, global_oneshot } = received_data;

  const activeTime =
    mode !== "preview" ? received_data.global_active_time : Infinity;
  const inactiveTime = received_data.global_inactive_time;

  const processAlt = (index) => {
    const prefix = `alt_${index}_`;
    const get = (key, fallback) => received_data[`${prefix}${key}`] ?? fallback;

    document.getElementById(`alt-${index}-name`).innerHTML = get("name", "");
    document.getElementById(`alt-${index}-info`).innerHTML = get("info", "");

    let style_color_1 = get("style_color_1");
    let style_color_2 = get("style_color_2");
    let style_color_3 = get("style_color_3");
    let style_color_4 = get("style_color_4");
    let line_spacing = get("line_spacing", 0) * 0.1;
    let border_thickness = get("border_thickness_amount", 0) * 0.1;

    if (get("background_switch") === "false") {
      style_color_1 = "none";
      style_color_2 = "none";
    }

    if (get("border_switch") === "false") {
      style_color_3 = "none";
      style_color_4 = "none";
      border_thickness = 0;
    }

    const animation_time = Number(get("animation_time", global_animation_time));
    let active_time = Number(get("active_time", activeTime));
    let inactive_time = Number(get("inactive_time", inactiveTime));

    if (inactive_time < animation_time) inactive_time = animation_time;
    if (active_time < animation_time) active_time = animation_time;

    const oneshot =
      get("oneshot") ||
      (global_oneshot && !received_data[`${prefix}inactive_time`]);

    // Aqui você pode armazenar ou usar as variáveis `style_color_*`, `line_spacing`, etc.
    // Exemplo:
    window[`${prefix}animation_time`] = animation_time;
    window[`${prefix}active_time`] = active_time;
    window[`${prefix}inactive_time`] = inactive_time;
    window[`${prefix}oneshot`] = oneshot;
    // Adicione mais ações aqui se necessário.
  };

  // Processa os ALT 1 ao 4
  [1, 2, 3, 4].forEach((i) => processAlt(i));
  const lowerThirds = [
    {
      id: 1,
      switchVal: alt_1_switch,
      name: alt_1_name,
      info: alt_1_info,
      align: alt_1_align,
      oldAlign: alt_1_align_old,
      style: alt_1_style,
      oldStyle: alt_1_style_old,
      canIn: canIn1,
      preview: alt_1_preview,
      activeTimeVar: "alt_1_active_time",
    },
    {
      id: 2,
      switchVal: alt_2_switch,
      name: alt_2_name,
      info: alt_2_info,
      align: alt_2_align,
      oldAlign: alt_2_align_old,
      style: alt_2_style,
      oldStyle: alt_2_style_old,
      canIn: canIn2,
      preview: alt_2_preview,
      activeTimeVar: "alt_2_active_time",
    },
    {
      id: 3,
      switchVal: alt_3_switch,
      name: alt_3_name,
      info: alt_3_info,
      align: alt_3_align,
      oldAlign: alt_3_align_old,
      style: alt_3_style,
      oldStyle: alt_3_style_old,
      canIn: canIn3,
      preview: alt_3_preview,
      activeTimeVar: "alt_3_active_time",
    },
    {
      id: 4,
      switchVal: alt_4_switch,
      name: alt_4_name,
      info: alt_4_info,
      align: alt_4_align,
      oldAlign: alt_4_align_old,
      style: alt_4_style,
      oldStyle: alt_4_style_old,
      canIn: canIn4,
      preview: alt_4_preview,
      activeTimeVar: "alt_4_active_time",
    },
  ];

  // Set infinite time if preview mode
  if (mode === "preview") {
    lowerThirds.forEach((lt, i) => {
      window[lt.activeTimeVar] = Infinity;
      lowerThirds[i].switchVal = lt.preview;
    });
  }

  // Utility to update alignment
  function updateAlignment(element, currentAlign, previousAlign, isHidden) {
    if (currentAlign !== previousAlign) {
      if (isHidden) element.classList.add("hide-anim");

      ["left", "center", "right"].forEach((alignment) => {
        element.classList.replace(alignment, currentAlign);
      });
    }
  }

  // Utility to update style
  function updateStyle(element, currentStyle, previousStyle, isHidden) {
    if (currentStyle !== previousStyle) {
      if (isHidden) element.classList.add("hide-anim");

      ["style-1", "style-2", "style-3"].forEach((styleClass) => {
        element.classList.replace(styleClass, `style-${currentStyle}`);
      });
    }
  }

  // Process each lower third
  lowerThirds.forEach((lt, index) => {
    const el = document.getElementById(`lower-third-${lt.id}`);

    const shouldHide =
      lt.switchVal === "false" || lt.name.length === 0 || lt.info.length === 0;

    if (shouldHide) {
      if (lt.canIn) {
        lowerThirds[index].canIn = false;
      }
      stopTimeCount(`lower-third-${lt.id}`);
    } else {
      if (!lt.canIn) {
        lowerThirds[index].canIn = true;
        el.classList.remove("hide-anim");
        startActiveCount(`lower-third-${lt.id}`);
      }
    }

    updateAlignment(el, lt.align, lt.oldAlign, lt.switchVal === "false");
    lowerThirds[index].oldAlign = lt.align;

    updateStyle(el, lt.style, lt.oldStyle, lt.switchVal === "false");
    lowerThirds[index].oldStyle = lt.style;
  });

  ///////////////////////////
  // Agrupando dados de cada alt em um único array com os logos e variáveis antigas (old)
  const alts = [
    {
      id: "alt-1",
      logoImage: alt_1_logo_image,
      logoImageOldRef: () => alt_1_logo_image_old,
      setLogoImageOld: (val) => (alt_1_logo_image_old = val),
      logoSwitch: alt_1_logo_switch,
      backgroundSwitch: alt_1_background_switch,
      animationTime: alt_1_animation_time,
      size: alt_1_size,
      margin_h: alt_1_margin_h,
      margin_v: alt_1_margin_v,
      line_spacing: alt_1_line_spacing,
      name_size: alt_1_name_size,
      info_size: alt_1_info_size,
      name_transform: alt_1_name_transform,
      info_transform: alt_1_info_transform,
      name_weight: alt_1_name_weight,
      info_weight: alt_1_info_weight,
      name_color: alt_1_name_color,
      info_color: alt_1_info_color,
      style_color_1: alt_1_style_color_1,
      style_color_2: alt_1_style_color_2,
      style_color_3: alt_1_style_color_3,
      style_color_4: alt_1_style_color_4,
      font: alt_1_font,
      logo_size: alt_1_logo_size,
      corners: alt_1_corners,
      border_switch: alt_1_border_switch,
      border_thickness_amount: alt_1_border_thickness_amount,
    },
    {
      id: "alt-2",
      logoImage: alt_2_logo_image,
      logoImageOldRef: () => alt_2_logo_image_old,
      setLogoImageOld: (val) => (alt_2_logo_image_old = val),
      logoSwitch: alt_2_logo_switch,
      backgroundSwitch: alt_2_background_switch,
      animationTime: alt_2_animation_time,
      size: alt_2_size,
      margin_h: alt_2_margin_h,
      margin_v: alt_2_margin_v,
      line_spacing: alt_2_line_spacing,
      name_size: alt_2_name_size,
      info_size: alt_2_info_size,
      name_transform: alt_2_name_transform,
      info_transform: alt_2_info_transform,
      name_weight: alt_2_name_weight,
      info_weight: alt_2_info_weight,
      name_color: alt_2_name_color,
      info_color: alt_2_info_color,
      style_color_1: alt_2_style_color_1,
      style_color_2: alt_2_style_color_2,
      style_color_3: alt_2_style_color_3,
      style_color_4: alt_2_style_color_4,
      font: alt_2_font,
      logo_size: alt_2_logo_size,
      corners: alt_2_corners,
      border_switch: alt_2_border_switch,
      border_thickness_amount: alt_2_border_thickness_amount,
    },
    {
      id: "alt-3",
      logoImage: alt_3_logo_image,
      logoImageOldRef: () => alt_3_logo_image_old,
      setLogoImageOld: (val) => (alt_3_logo_image_old = val),
      logoSwitch: alt_3_logo_switch,
      backgroundSwitch: alt_3_background_switch,
      animationTime: alt_3_animation_time,
      size: alt_3_size,
      margin_h: alt_3_margin_h,
      margin_v: alt_3_margin_v,
      line_spacing: alt_3_line_spacing,
      name_size: alt_3_name_size,
      info_size: alt_3_info_size,
      name_transform: alt_3_name_transform,
      info_transform: alt_3_info_transform,
      name_weight: alt_3_name_weight,
      info_weight: alt_3_info_weight,
      name_color: alt_3_name_color,
      info_color: alt_3_info_color,
      style_color_1: alt_3_style_color_1,
      style_color_2: alt_3_style_color_2,
      style_color_3: alt_3_style_color_3,
      style_color_4: alt_3_style_color_4,
      font: alt_3_font,
      logo_size: alt_3_logo_size,
      corners: alt_3_corners,
      border_switch: alt_3_border_switch,
      border_thickness_amount: alt_3_border_thickness_amount,
    },
    {
      id: "alt-4",
      logoImage: alt_4_logo_image,
      logoImageOldRef: () => alt_4_logo_image_old,
      setLogoImageOld: (val) => (alt_4_logo_image_old = val),
      logoSwitch: alt_4_logo_switch,
      backgroundSwitch: alt_4_background_switch,
      animationTime: alt_4_animation_time,
      size: alt_4_size,
      margin_h: alt_4_margin_h,
      margin_v: alt_4_margin_v,
      line_spacing: alt_4_line_spacing,
      name_size: alt_4_name_size,
      info_size: alt_4_info_size,
      name_transform: alt_4_name_transform,
      info_transform: alt_4_info_transform,
      name_weight: alt_4_name_weight,
      info_weight: alt_4_info_weight,
      name_color: alt_4_name_color,
      info_color: alt_4_info_color,
      style_color_1: alt_4_style_color_1,
      style_color_2: alt_4_style_color_2,
      style_color_3: alt_4_style_color_3,
      style_color_4: alt_4_style_color_4,
      font: alt_4_font,
      logo_size: alt_4_logo_size,
      corners: alt_4_corners,
      border_switch: alt_4_border_switch,
      border_thickness_amount: alt_4_border_thickness_amount,
    },
  ];

  // Atualiza logos que mudaram e salva o valor antigo
  alts.forEach(({ id, logoImage, logoImageOldRef, setLogoImageOld }) => {
    if (logoImage !== logoImageOldRef()) {
      loadLogo(`${id}-logo-image`, logoImage);
      setLogoImageOld(logoImage);
    }
  });

  // Função para extrair switches e imagens para chamar changeLogoVisibility
  function getLogoVisibilityParams(alts) {
    const params = [];
    alts.forEach(({ logoSwitch, logoImage }) => {
      params.push(logoSwitch, logoImage);
    });
    return params;
  }

  // Chama changeLogoVisibility com parâmetros organizados
  changeLogoVisibility(...getLogoVisibilityParams(alts));

  // Setando propriedades CSS nas variáveis do :root
  const root = document.documentElement;

  const propsWithUnits = {
    animationTime: "s",
    size: "px",
    margin_h: "rem",
    margin_v: "rem",
    line_spacing: "em",
    name_size: "em",
    info_size: "em",
    logo_size: "em",
    corners: "em",
    border_thickness_amount: "rem",
  };

  const propsNoUnits = [
    "backgroundSwitch",
    "name_transform",
    "info_transform",
    "name_weight",
    "info_weight",
    "name_color",
    "info_color",
    "style_color_1",
    "style_color_2",
    "style_color_3",
    "style_color_4",
    "font",
    "border_switch",
  ];

  alts.forEach((alt) => {
    // Exemplo se quiser usar o backgroundSwitch como número (0 ou 1)
    // root.style.setProperty(`--${alt.id}-background`, alt.backgroundSwitch === "true" ? "1" : "0");

    Object.entries(propsWithUnits).forEach(([prop, unit]) => {
      if (alt[prop] !== undefined) {
        root.style.setProperty(
          `--${alt.id}-${prop.replace(/_/g, "-")}`,
          alt[prop] + unit
        );
      }
    });

    propsNoUnits.forEach((prop) => {
      if (alt[prop] !== undefined) {
        root.style.setProperty(
          `--${alt.id}-${prop.replace(/_/g, "-")}`,
          alt[prop]
        );
      }
    });
  });

  const altsShadowAndBackground = [
    {
      prefix: "alt-1",
      styleColor2: alt_1_style_color_2,
      shadows: alt_1_shadows,
      shadowAmount: alt_1_shadow_amount,
      backgroundSwitch: alt_1_background_switch,
    },
    {
      prefix: "alt-2",
      styleColor2: alt_2_style_color_2,
      shadows: alt_2_shadows,
      shadowAmount: alt_2_shadow_amount,
      backgroundSwitch: alt_2_background_switch,
    },
    {
      prefix: "alt-3",
      styleColor2: alt_3_style_color_2,
      shadows: alt_3_shadows,
      shadowAmount: alt_3_shadow_amount,
      backgroundSwitch: alt_3_background_switch,
    },
    {
      prefix: "alt-4",
      styleColor2: alt_4_style_color_2,
      shadows: alt_4_shadows,
      shadowAmount: alt_4_shadow_amount,
      backgroundSwitch: alt_4_background_switch,
    },
  ];

  altsShadowAndBackground.forEach(
    ({ prefix, styleColor2, shadows, shadowAmount, backgroundSwitch }) => {
      // Define se o background shadow deve ficar visível (1) ou escondido (0)
      const backgroundValue = styleColor2.match(/,0\)$/) ? "0" : "1";
      root.style.setProperty(`--${prefix}-background`, backgroundValue);

      if (shadows === "false") {
        root.style.setProperty(`--${prefix}-shadows`, "none");
        root.style.setProperty(`--${prefix}-shadows-graph`, "none");
      } else if (shadows === "true") {
        const shadowCss = `0.1rem 0.1rem 0.2rem rgba(0,0,0,${shadowAmount})`;
        root.style.setProperty(`--${prefix}-shadows`, shadowCss);
        root.style.setProperty(
          `--${prefix}-shadows-graph`,
          backgroundSwitch === "false" ? "none" : shadowCss
        );
      }
    }
  );

  bcf.onmessage = function (ev) {
    received_data = ev.data;
    new_font = received_data.new_font_to_send;

    //console.log(new_font);
    $("head").append("<style>" + new_font + "</style>");
  };

  function loadLogo(alt, logo) {
    if (logo) {
      $("#" + alt).attr("src", logo);
    } else {
      $("#" + alt).attr("src", "//:0");
    }
  }
};

function function_send() {
  // Array com pares [c, d] para cada índice
  const times = [
    [c1, d1],
    [c2, d2],
    [c3, d3],
    [c4, d4],
  ];

  // Função para ajustar o tempo (subtrai 1 e garante >= 0)
  const adjustTime = (value) => Math.max(value - 1, 0);

  // Monta os objetos para enviar dinamicamente
  const payload = {};

  times.forEach(([active, inactive], i) => {
    payload[`activeTime${i + 1}_to_send`] = adjustTime(active);
    payload[`inactiveTime${i + 1}_to_send`] = adjustTime(inactive);
  });

  // Acrescenta os valores turnoff ao payload
  payload.alt_1_turnoff = alt_1_turnoff;
  payload.alt_2_turnoff = alt_2_turnoff;
  payload.alt_3_turnoff = alt_3_turnoff;
  payload.alt_4_turnoff = alt_4_turnoff;

  // Envia a mensagem
  bcr.postMessage(payload);

  // Reseta os turnoffs
  alt_1_turnoff = false;
  alt_2_turnoff = false;
  alt_3_turnoff = false;
  alt_4_turnoff = false;
}

function refreshData() {
  if (mode !== "preview") {
    function_send();
  }
}

const x = 1; // Refresh time multiplier
setInterval(refreshData, x * 1000);
bcr.postMessage({ resend: true });
