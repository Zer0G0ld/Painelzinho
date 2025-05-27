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
 * Carrega valores padrão nos inputs e checkboxes
 * Usa um objeto de mapeamento para deixar mais claro e fácil manutenção.
 * Usa `document.querySelectorAll` puro e verifica método (val ou prop)
 */
export function loadDefaultValues() {
  const map = {
    "-style": { value: defaultValues.style, method: "value" },
    "-size": { value: defaultValues.size, method: "value" },
    "-margin-h": { value: defaultValues.marginH, method: "value" },
    "-margin-v": { value: defaultValues.marginV, method: "value" },
    "-inverse-ratio": { value: defaultValues.inverseRatio, method: "value" },
    "-line-spacing": { value: defaultValues.lineSpacing, method: "value" },
    "-logo": { value: defaultValues.logo, method: "checked" },
    "-logo-size": { value: defaultValues.logoSize, method: "value" },
    "-shadow": { value: defaultValues.shadow, method: "checked" },
    "-shadow-amount": { value: defaultValues.shadowAmount, method: "value" },
    "-background": { value: defaultValues.background, method: "checked" },
    "-style-color-1": { value: defaultValues.styleColor1, method: "value" },
    "-style-color-2": { value: defaultValues.styleColor2, method: "value" },
    "-corners": { value: defaultValues.corners, method: "value" },
    "-border-thickness": { value: defaultValues.borderThickness, method: "checked" },
    "-border-thickness-amount": { value: defaultValues.borderThicknessAmount, method: "value" },
    "-border-color": { value: defaultValues.borderColor, method: "checked" },
    "-style-color-3": { value: defaultValues.styleColor3, method: "value" },
    "-style-color-4": { value: defaultValues.styleColor4, method: "value" },
    "-name-transform": { value: defaultValues.nameTransform, method: "checked" },
    "-name-weight": { value: defaultValues.nameWeight, method: "checked" },
    "-name-color": { value: defaultValues.nameColor, method: "value" },
    "-info-transform": { value: defaultValues.infoTransform, method: "checked" },
    "-info-weight": { value: defaultValues.infoWeight, method: "checked" },
    "-info-color": { value: defaultValues.infoColor, method: "value" },
  };

  Object.entries(map).forEach(([suffix, { value, method }]) => {
    const elements = document.querySelectorAll(`[id^=alt-][id$=${suffix}]`);
    elements.forEach((el) => {
      if (method === "value") {
        el.value = value;
      } else if (method === "checked") {
        el.checked = value;
      }
    });
  });
}

/**
 * BroadcastChannel names encapsulados para fácil alteração
 */
const CHANNELS = {
  main: "obs-lower-thirds-channel",
  response: "obs-lower-thirds-channel2",
  fonts: "obs-lower-thirds-fonts",
};

/**
 * Instâncias de BroadcastChannel
 */
export const bc = new BroadcastChannel(CHANNELS.main);
export const bcr = new BroadcastChannel(CHANNELS.response);
export const bcf = new BroadcastChannel(CHANNELS.fonts);

/**
 * Estado das alternativas (alts) com inicialização clara e propriedades undefined por padrão
 */
const createAlt = (num) => ({
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
});

export const alts = [1, 2, 3, 4].map(createAlt);

/**
 * Hotkeys antigos agrupados para manutenção simples e clara
 */
export const hotkeysOld = {
  masterSwitch: hotkeyMasterSwitch,
  switches: [hotkeySwitch1, hotkeySwitch2, hotkeySwitch3, hotkeySwitch4],
  altSlots: [1, 2, 3, 4].map(
    (altNum) =>
      Array.from({ length: 10 }, (_, i) => window[`hotkeyAlt${altNum}Slot${i + 1}`])
  ),
};
