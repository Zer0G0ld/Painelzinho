
function getAppearance() {
  const altCount = 4;

  // Containers para os valores coletados (se quiser manter global, declare fora)
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
    // Style
    styles[i] = $(`#alt-${i}-style`).val() || default_style;
    $(`#alt-${i}-style`).val(styles[i]);

    // Inverse ratio e cálculo dos tamanhos
    inverseRatios[i] =
      Number($(`#alt-${i}-inverse-ratio`).val()) || default_inverse_ratio;
    nameSizes[i] = 1 + inverseRatios[i] * 0.1;
    infoSizes[i] = 2 - inverseRatios[i] * 0.1;

    // Line spacing
    lineSpacings[i] = $(`#alt-${i}-line-spacing`).val() || default_line_spacing;

    // Size
    sizes[i] = $(`#alt-${i}-size`).val() || default_size;

    // Logo size (notei que faz cálculo +3.5; cuidado com o OR aqui)
    const rawLogoSize = Number($(`#alt-${i}-logo-size`).val());
    logoSizes[i] = !isNaN(rawLogoSize)
      ? rawLogoSize * 0.25 + 3.5
      : default_logo_size_em;

    // Shadow amount
    const rawShadow = Number($(`#alt-${i}-shadow-amount`).val());
    shadowAmounts[i] = !isNaN(rawShadow)
      ? rawShadow * 0.1
      : default_shadow_amount_em;

    // Corners
    const rawCorners = Number($(`#alt-${i}-corners`).val());
    corners[i] = !isNaN(rawCorners) ? rawCorners * 0.25 : default_corners;

    // Border thickness
    borderThicknesses[i] =
      $(`#alt-${i}-border-thickness-amount`).val() ||
      default_border_thickness_amount;

    // Margins horizontal and vertical
    marginsH[i] = $(`#alt-${i}-margin-h`).val() || default_margin_h;
    marginsV[i] = $(`#alt-${i}-margin-v`).val() || default_margin_v;
  }

  // Se você quiser, pode fazer algo com esses dados, tipo salvar em variáveis globais
  // ou atualizar seu estado, ou mesmo retornar:

  // Exemplo de retorno:
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

  // Lembre-se de chamar styleRestrictions() depois se precisar!
  //styleRestrictions()
}

function applyStyleRestrictions(prefix, style) {
  const alignCenter = document.getElementById(`${prefix}-align-center`);
  const alignLeft = $(`#${prefix}-align-left`);
  const logo = document.getElementById(`${prefix}-logo`);
  const logoSize = document.getElementById(`${prefix}-logo-size`);
  const borderColorAppearance = $(
    `#${prefix}-style-border-color-appearance > :nth-child(3)`
  );

  switch (style) {
    case "1":
      alignCenter.disabled = true;
      if (alignCenter.checked) {
        alignLeft.prop("checked", true).change();
      }
      logo.disabled = false;
      logoSize.disabled = false;
      borderColorAppearance.addClass("disabled");
      break;
    case "2":
      alignCenter.disabled = false;
      logo.disabled = true;
      if (logo.checked) {
        $(logo).prop("checked", false).change();
      }
      borderColorAppearance.removeClass("disabled");
      break;
    case "3":
      alignCenter.disabled = true;
      if (alignCenter.checked) {
        alignLeft.prop("checked", true).change();
      }
      logo.disabled = false;
      logoSize.disabled = true;
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
