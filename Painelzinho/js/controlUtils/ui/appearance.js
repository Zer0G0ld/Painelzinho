// appearance.js
function getAppearance() {
  [1,2,3,4].forEach(i => {
    window[`alt_${i}_style`] = $(`#alt-${i}-style`).val() || default_style;
    $(`#alt-${i}-style`).val(window[`alt_${i}_style`]);

    const inverse_ratio = $(`#alt-${i}-inverse-ratio`).val() || default_inverse_ratio;
    window[`alt_${i}_inverse_ratio`] = inverse_ratio;
    window[`alt_${i}_name_size`] = 1 + inverse_ratio * 0.1;
    window[`alt_${i}_info_size`] = 2 - inverse_ratio * 0.1;

    window[`alt_${i}_line_spacing`] = $(`#alt-${i}-line-spacing`).val() || default_line_spacing;
    window[`alt_${i}_size`] = $(`#alt-${i}-size`).val() || default_size;
    window[`alt_${i}_logo_size`] = Number($(`#alt-${i}-logo-size`).val()) * 0.25 + 3.5 || default_logo_size_em;
    window[`alt_${i}_shadow_amount`] = $(`#alt-${i}-shadow-amount`).val() * 0.1 || default_shadow_amount_em;
    window[`alt_${i}_corners`] = Number($(`#alt-${i}-corners`).val()) * 0.25 || default_corners;
    window[`alt_${i}_border_thickness_amount`] = $(`#alt-${i}-border-thickness-amount`).val() || default_border_thickness_amount;
    window[`alt_${i}_margin_h`] = $(`#alt-${i}-margin-h`).val() || default_margin_h;
    window[`alt_${i}_margin_v`] = $(`#alt-${i}-margin-v`).val() || default_margin_v;
  });

  styleRestrictions();
}

function styleRestrictions() {
  [1,2,3,4].forEach(i => {
    const styleValue = window[`alt_${i}_style`];
    const alignCenter = document.getElementById(`alt-${i}-align-center`);
    const alignLeft = $(`#alt-${i}-align-left`);
    const logo = document.getElementById(`alt-${i}-logo`);
    const logoSize = document.getElementById(`alt-${i}-logo-size`);
    const borderColor = $(`#alt-${i}-style-border-color-appearance > :nth-child(3)`);

    switch (styleValue) {
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
        if (logo.checked) $(`#alt-${i}-logo`).prop("checked", false).change();
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
  });
}

export { getAppearance, styleRestrictions };