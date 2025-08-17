// slots.js
import { hotkeys } from "../hotkeys/hotkeys.js";
import { refreshData } from "../../control-panel.js";

// Carrega dados em um slot específico
function loadSlot(nameSelector, infoSelector, logoSelector, slotIndex = 1, altWaitingTime = 0, fromHotkey = true) {
  const altPrefix = nameSelector.replace("#alt-", "").replace("-name", "").toUpperCase();
  const slotId = `${altPrefix}SLOT${slotIndex}`;
  const slotValue = hotkeys.slots[slotId] || {};

  setTimeout(() => {
    const defaultLogoSelector = logoSelector.replace("-preview", "-default");
    const defaultLogoValue = $(defaultLogoSelector).attr("src");

    $(nameSelector + ":text").val(slotValue.name || "").change();
    $(infoSelector + ":text").val(slotValue.info || "").change();
    $(logoSelector).attr("src", slotValue.logo === "default" ? defaultLogoValue : slotValue.logo || defaultLogoValue).change();

    refreshData();
  }, altWaitingTime * 1000);

  if (fromHotkey) {
    const autoTriggerId = nameSelector.replace("#", "").replace("-name", "-autotrigger");
    const altSwitch = nameSelector.replace("#alt-", "").replace("-name", "");

    if (document.getElementById(autoTriggerId)?.checked &&
        $(`#painelzinhos-switch${altSwitch}`).is(":not(:checked)")) {
      $(`#painelzinhos-switch${altSwitch}`).prop("checked", true).change();
    }
  }
}

// Limpa inputs de um slot específico
function cleanSlot(slotNum, slotIndex = 1) {
  const nameSelector = `#alt-${slotNum}-name:text`;
  const infoSelector = `#alt-${slotNum}-info:text`;
  const logoSelector = `#alt-${slotNum}-logo-preview`;
  const logoDefaultSelector = `#alt-${slotNum}-logo-default`;

  $(nameSelector).val("").change();
  $(infoSelector).val("").change();
  $(logoSelector).attr("src", $(logoDefaultSelector).attr("src")).change();

  // Atualiza hotkeys.slots
  const slotId = `ALT${slotNum}SLOT${slotIndex}`;
  hotkeys.slots[slotId] = { name: "", info: "", logo: "default" };
}

// Inicializa eventos de limpeza para todos os slots e ALTs
function initSlotCleaners(totalAlts = 4, slotsPerAlt = 10) {
  for (let alt = 1; alt <= totalAlts; alt++) {
    for (let slot = 1; slot <= slotsPerAlt; slot++) {
      $(`#alt-${alt}-clean-inputs-slot${slot}`).off("click").on("click", () => cleanSlot(alt, slot));
    }
  }
}

export { loadSlot, cleanSlot, initSlotCleaners };
