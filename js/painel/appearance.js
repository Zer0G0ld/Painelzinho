const altCount = 4;

function getInputValue(selector, defaultValue, parseFn = (v) => v) {
  const val = $(selector).val();
  if (val === undefined || val === null || val === "") return defaultValue;
  try {
    return parseFn(val);
  } catch {
    return defaultValue;
  }
}

function getAppearance() {
  const styles = {};
  const inverseRatios = {};
  const nameSizes = {};
  const infoSizes = {};
  const lineSpacings = {};
  const sizes = {};
  const logoSizes = {};
  const shadowAmounts = {};
  const corners = {};
  const borderThicknesses = {};
  const marginsH = {};
  const marginsV = {};

  for (let i = 1; i <= altCount; i++) {
    const prefix = `#alt-${i}`;

    // Style (string)
    styles[i] = getInputValue(`${prefix}-style`, default_style, String);
    // Reaplica valor para garantir input consistente
    $(`${prefix}-style`).val(styles[i]);

    // Inverse ratio (number)
    inverseRatios[i] = getInputValue(
      `${prefix}-inverse-ratio`,
      default_inverse_ratio,
      Number
    );

    // Calcula tamanhos derivados
    nameSizes[i] = 1 + inverseRatios[i] * 0.1;
    infoSizes[i] = 2 - inverseRatios[i] * 0.1;

    // Outros valores (strings ou números)
    lineSpacings[i] = getInputValue(`${prefix}-line-spacing`, default_line_spacing, String);
    sizes[i] = getInputValue(`${prefix}-size`, default_size, String);

    // Logo size com cálculo e fallback
    const rawLogo = getInputValue(`${prefix}-logo-size`, null, Number);
    logoSizes[i] = rawLogo !== null && !isNaN(rawLogo)
      ? rawLogo * 0.25 + 3.5
      : default_logo_size_em;

    // Shadow amount
    const rawShadow = getInputValue(`${prefix}-shadow-amount`, null, Number);
    shadowAmounts[i] = rawShadow !== null && !isNaN(rawShadow)
      ? rawShadow * 0.1
      : default_shadow_amount_em;

    // Corners
    const rawCorners = getInputValue(`${prefix}-corners`, null, Number);
    corners[i] = rawCorners !== null && !isNaN(rawCorners)
      ? rawCorners * 0.25
      : default_corners;

    // Border thickness (string)
    borderThicknesses[i] = getInputValue(`${prefix}-border-thickness-amount`, default_border_thickness_amount, String);

    // Margins horizontal e vertical (strings)
    marginsH[i] = getInputValue(`${prefix}-margin-h`, default_margin_h, String);
    marginsV[i] = getInputValue(`${prefix}-margin-v`, default_margin_v, String);
  }

  return {
    styles,
    inverseRatios,
    nameSizes,
    infoSizes,
    lineSpacings,
    sizes,
    logoSizes,
    shadowAmounts,
    corners,
    borderThicknesses,
    marginsH,
    marginsV,
  };
}

function applyStyleRestrictions(prefix, style) {
  // Uso DOM nativo e jQuery onde mais conveniente
  const alignCenter = document.getElementById(`${prefix}-align-center`);
  const alignLeft = $(`#${prefix}-align-left`);
  const logo = document.getElementById(`${prefix}-logo`);
  const logoSize = document.getElementById(`${prefix}-logo-size`);
  const borderColorAppearance = $(`#${prefix}-style-border-color-appearance > :nth-child(3)`);

  switch (style) {
    case "1":
      alignCenter.disabled = true;
      if (alignCenter.checked) {
        alignLeft.prop("checked", true).trigger("change");
      }
      logo.disabled = false;
      logoSize.disabled = false;
      borderColorAppearance.addClass("disabled");
      break;

    case "2":
      alignCenter.disabled = false;
      logo.disabled = true;
      if (logo.checked) {
        $(logo).prop("checked", false).trigger("change");
      }
      borderColorAppearance.removeClass("disabled");
      break;

    case "3":
      alignCenter.disabled = true;
      if (alignCenter.checked) {
        alignLeft.prop("checked", true).trigger("change");
      }
      logo.disabled = false;
      logoSize.disabled = true;
      borderColorAppearance.removeClass("disabled");
      break;

    default:
      // Caso nenhum dos estilos, habilita tudo por segurança
      alignCenter.disabled = false;
      logo.disabled = false;
      logoSize.disabled = false;
      borderColorAppearance.removeClass("disabled");
      break;
  }
}

function styleRestrictions() {
  applyStyleRestrictions("alt-1", alt_1_style);
  applyStyleRestrictions("alt-2", alt_2_style);
  applyStyleRestrictions("alt-3", alt_3_style);
  applyStyleRestrictions("alt-4", alt_4_style);
}
