// appearance.js

// Estado global de aparência por slot
const slotAppearance = {};

// Carrega aparência de todos os slots
function getAppearance(totalSlots = 4) {
  for (let i = 1; i <= totalSlots; i++) {
    const slotId = `alt-${i}`;

    const style = $(`#${slotId}-style`).val() || default_style;
    const inverseRatio = Number($(`#${slotId}-inverse-ratio`).val()) || default_inverse_ratio;
    const lineSpacing = Number($(`#${slotId}-line-spacing`).val()) || default_line_spacing;
    const size = Number($(`#${slotId}-size`).val()) || default_size;
    const logoSize = Number($(`#${slotId}-logo-size`).val()) * 0.25 + 3.5 || default_logo_size_em;
    const shadow = Number($(`#${slotId}-shadow-amount`).val()) * 0.1 || default_shadow_amount_em;
    const corners = Number($(`#${slotId}-corners`).val()) * 0.25 || default_corners;
    const borderThickness = Number($(`#${slotId}-border-thickness-amount`).val()) || default_border_thickness_amount;
    const marginH = Number($(`#${slotId}-margin-h`).val()) || default_margin_h;
    const marginV = Number($(`#${slotId}-margin-v`).val()) || default_margin_v;

    slotAppearance[i] = {
      style,
      inverseRatio,
      lineSpacing,
      size,
      logoSize,
      shadow,
      corners,
      borderThickness,
      marginH,
      marginV,
      nameSize: 1 + inverseRatio * 0.1,
      infoSize: 2 - inverseRatio * 0.1
    };
  }

  styleRestrictions(slotAppearance);
}

// Aplica restrições de estilo
function styleRestrictions(slots) {
  for (const [i, slot] of Object.entries(slots)) {
    const slotNum = i;
    const style = slot.style;

    const alignCenter = document.getElementById(`alt-${slotNum}-align-center`);
    const alignLeft = $(`#alt-${slotNum}-align-left`);
    const logo = document.getElementById(`alt-${slotNum}-logo`);
    const logoSize = document.getElementById(`alt-${slotNum}-logo-size`);
    const borderColor = $(`#alt-${slotNum}-style-border-color-appearance > :nth-child(3)`);

    switch (style) {
      case "1":
        alignCenter.disabled = true;
        if (alignCenter.checked) alignLeft.prop("checked", true).change();
        logo.disabled = false;
        logoSize.disabled = false;
        borderColor.addClass("disabled");
        break;
      case "2":
        alignCenter.disabled = false;
        logo.disabled = true;
        logoSize.disabled = false;
        if (logo.checked) $(`#alt-${slotNum}-logo`).prop("checked", false).change();
        borderColor.removeClass("disabled");
        break;
      case "3":
        alignCenter.disabled = true;
        if (alignCenter.checked) alignLeft.prop("checked", true).change();
        logo.disabled = false;
        logoSize.disabled = true;
        borderColor.removeClass("disabled");
        break;
    }
  }
}

export { getAppearance, styleRestrictions, slotAppearance };
