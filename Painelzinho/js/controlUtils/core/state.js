let slotDeleted = false;
let newFontToSend;

const alternates = {};
["alt_1", "alt_2", "alt_3", "alt_4"].forEach((alt) => {
  alternates[alt] = {
    activeTimeMonitor: null,
    inactiveTimeMonitor: null,
    autoload: null,
    jumpnext: null,
    autotrigger: null,
    oneshot: null,
    lockActive: null,
    logoDefault: `../logos/logo_${alt.split("_")[1]}.png`,
    style: default_style,
    inverseRatio: default_inverse_ratio,
    nameSize: null,
    infoSize: null,
    size: null,
    lineSpacing: null,
    marginH: null,
    marginV: null,
    shadows: null,
    font: null,
    logoSize: null,
    shadowAmount: null,
    corners: null,
    borderThicknessAmount: null,
    turnOff: false,
  };
});

export { slotDeleted, newFontToSend, alternates };