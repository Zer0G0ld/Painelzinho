/**
 * DEFAULT VALUES
 */
export const defaultValues = {
  style: 1,
  size: 24,
  marginH: 4,
  marginV: 4,
  inverseRatio: 9,
  lineSpacing: 0,
  logo: true,
  logoSize: 0,
  logoSizeEm: 3.5,
  shadow: false,
  shadowAmount: 5,
  shadowAmountEm: 0.5,
  background: true,
  styleColor1: "#D54141",
  styleColor2: "#222222",
  corners: 0,
  borderThickness: false,
  borderThicknessAmount: 0,
  borderColor: false,
  styleColor3: "#D54141",
  styleColor4: "#222222",
  nameTransform: true,
  nameWeight: true,
  nameColor: "#F2F2F2",
  infoTransform: false,
  infoWeight: false,
  infoColor: "#8A8A8A",
};

/**
 * Função para carregar valores padrão nos inputs e checkboxes
 */
export function loadDefaultValues() {
  const map = [
    ["-style", defaultValues.style, "val"],
    ["-size", defaultValues.size, "val"],
    ["-margin-h", defaultValues.marginH, "val"],
    ["-margin-v", defaultValues.marginV, "val"],
    ["-inverse-ratio", defaultValues.inverseRatio, "val"],
    ["-line-spacing", defaultValues.lineSpacing, "val"],
    ["-logo", defaultValues.logo, "prop"],
    ["-logo-size", defaultValues.logoSize, "val"],
    ["-shadow", defaultValues.shadow, "prop"],
    ["-shadow-amount", defaultValues.shadowAmount, "val"],
    ["-background", defaultValues.background, "prop"], // corrigido .prop("checked", ...)
    ["-style-color-1", defaultValues.styleColor1, "val"],
    ["-style-color-2", defaultValues.styleColor2, "val"],
    ["-corners", defaultValues.corners, "val"],
    ["-border-thickness", defaultValues.borderThickness, "prop"],
    ["-border-thickness-amount", defaultValues.borderThicknessAmount, "val"],
    ["-border-color", defaultValues.borderColor, "prop"],
    ["-style-color-3", defaultValues.styleColor3, "val"],
    ["-style-color-4", defaultValues.styleColor4, "val"],
    ["-name-transform", defaultValues.nameTransform, "prop"],
    ["-name-weight", defaultValues.nameWeight, "prop"],
    ["-name-color", defaultValues.nameColor, "val"],
    ["-info-transform", defaultValues.infoTransform, "prop"],
    ["-info-weight", defaultValues.infoWeight, "prop"],
    ["-info-color", defaultValues.infoColor, "val"],
  ];

  map.forEach(([suffix, value, method]) => {
    const selector = `[id^=alt-][id$=${suffix}]`;
    if (method === "val") {
      $(selector).val(value);
    } else if (method === "prop") {
      $(selector).prop("checked", value);
    }
  });
}

/**
 * Variáveis para canais BroadcastChannel
 */
export const bc = new BroadcastChannel("obs-lower-thirds-channel"); // Send to browser source
export const bcr = new BroadcastChannel("obs-lower-thirds-channel2"); // Receives from the source
export const bcf = new BroadcastChannel("obs-lower-thirds-fonts"); // Send custom fonts

/**
 * Variáveis agrupadas para cada alternativa (alt)
 */
export const alts = [1, 2, 3, 4].map((num) => ({
  style: defaultValues.style,
  inverseRatio: defaultValues.inverseRatio,
  nameSize: undefined,
  infoSize: undefined,
  size: undefined,
  lineSpacing: undefined,
  marginH: undefined,
  marginV: undefined,
  shadows: undefined,
  font: undefined,
  logoSize: undefined,
  shadowAmount: undefined,
  corners: undefined,
  borderThicknessAmount: undefined,
  turnoff: false,
  autoload: undefined,
  jumpnext: undefined,
  autotrigger: undefined,
  oneshot: undefined,
  lockActive: undefined,
  logoDefault: `../logos/logo_${num}.png`,
}));

// Exemplo de acesso: alts[0].style, alts[1].logoDefault, etc.

/**
 * Variáveis de hotkeys antigas, agrupadas para melhor manutenção
 */
export const hotkeysOld = {
  masterSwitch: hotkeyMasterSwitch,
  switches: [hotkeySwitch1, hotkeySwitch2, hotkeySwitch3, hotkeySwitch4],
  altSlots: [1, 2, 3, 4].map((altNum) =>
    Array(10)
      .fill(0)
      .map((_, i) => window[`hotkeyAlt${altNum}Slot${i + 1}`])
  ),
};
