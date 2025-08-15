const DEFAULTS = {
  style: 1,
  size: 24,
  margin: { horizontal: 4, vertical: 4 },
  inverseRatio: 9,
  lineSpacing: 0,
  logo: { enabled: true, sizePx: 0, sizeEm: 3.5 },
  shadow: { enabled: false, amount: 5, amountEm: 0.5 },
  background: true,
  colors: {
    primary1: "#D54141",
    primary2: "#222222",
    border1: "#D54141",
    border2: "#222222",
    name: "#F2F2F2",
    info: "#8A8A8A",
  },
  corners: 0,
  borderThickness: { enabled: false, amount: 0 },
  name: { transform: true, weight: true },
  info: { transform: false, weight: false },
};

function getDefaultValuesMap(defaults) {
  return {
    style: defaults.style,
    size: defaults.size,
    "margin-h": defaults.margin.horizontal,
    "margin-v": defaults.margin.vertical,
    "inverse-ratio": defaults.inverseRatio,
    "line-spacing": defaults.lineSpacing,
    logo: defaults.logo.enabled,
    "logo-size": defaults.logo.sizePx,
    shadow: defaults.shadow.enabled,
    "shadow-amount": defaults.shadow.amount,
    background: defaults.background,
    "style-color-1": defaults.colors.primary1,
    "style-color-2": defaults.colors.primary2,
    "style-color-3": defaults.colors.border1,
    "style-color-4": defaults.colors.border2,
    "border-thickness": defaults.borderThickness.enabled,
    "border-thickness-amount": defaults.borderThickness.amount,
    "border-color": false, // pode ser movido para DEFAULTS se quiser
    "name-transform": defaults.name.transform,
    "name-weight": defaults.name.weight,
    "name-color": defaults.colors.name,
    "info-transform": defaults.info.transform,
    "info-weight": defaults.info.weight,
    "info-color": defaults.colors.info,
  };
}

function loadDefaultValues(defaults = DEFAULTS) {
  const valuesMap = getDefaultValuesMap(defaults);

  Object.entries(valuesMap).forEach(([suffix, value]) => {
    // Seleciona todos os inputs que correspondem ao padrão alt-{n}-{suffix}
    const selector = `[id^="alt-"][id$="-${suffix}"]`;

    if (typeof value === "boolean") {
      $(selector).prop("checked", value);
    } else {
      $(selector).val(value);
    }
  });
}

export { DEFAULTS, getDefaultValuesMap, loadDefaultValues };
