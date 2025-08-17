// Painelzinho/js/controlUtils.bundle.js
import { hotkeys } from "./controlUtils/hotkeys/hotkeys.js";
import { loadSlot } from "./controlUtils/slots/slots.js";

// ------------------------
// Eventos seguros
// ------------------------


// Delegação de evento para elementos dinâmicos dentro de #sortable
document.addEventListener("click", (e) => {
  const stepBtn = e.target.closest("#sortable button");
  if (!stepBtn) return;

  const numberInput = stepBtn.parentNode.querySelector("input[type=number]");
  if (!numberInput) return;

  if (stepBtn.classList.contains("up")) numberInput.stepUp();
  if (stepBtn.classList.contains("down")) numberInput.stepDown();
});

// ------------------------
// Funções utilitárias básicas
// ------------------------
export function settingsTooltips() {
  console.log("Tooltips configurados.");
}

export function loadDefaultValues() {
  console.log("Valores padrão carregados.");
}

export function loadData() {
  console.log("Dados carregados.");
}

export function updateCustomFontList() {
  console.log("Lista de fontes customizadas atualizada.");
}

export function saveData() {
  console.log("Dados salvos.");
}

export function getAppearance() {
  console.log("Aparência atualizada.");
}

export function function_send() {
  console.log("Função send chamada.");
}

export function checkLogos() {
  console.log("Verificando logos customizados...");
}

// ------------------------
// Funções de slots
// ------------------------
export function checkSlots(memory_slot, nameSelector, infoSelector, logoSelector) {
  const slots = document.querySelectorAll(`${memory_slot} li`);
  slots.forEach(slot => {
    const slotId = slot.id.replace(/-/g, "").toUpperCase();
    const value = hotkeys.slots[slotId] || {};

    slot.classList.toggle("stored", !!(value.name || value.info || value.logo));
    slot.classList.toggle("active-slot", !!value.active);
    slot.classList.toggle("custom-logo", !!value.logo && value.logo !== "default");
  });
}

// ------------------------
// Refresh de dados
// ------------------------
export function refreshData() {
  console.log("refreshData iniciado");
  checkLogos();
  for (let i = 1; i <= 4; i++) {
    checkSlots(`#alt-${i}-memory-slots`, `#alt-${i}-name`, `#alt-${i}-info`, `#alt-${i}-logo-preview`);
  }
  getAppearance();
  checkSwitches();
  function_send();
}

// ------------------------
// Hotkeys
// ------------------------
export function checkHotkeys() {
  Object.keys(hotkeys.slots).forEach(slotId => {
    const slot = hotkeys.slots[slotId];
    if (!slot) return;
    if (slot.trigger) {
      loadSlot(`#${slotId}-name`, `#${slotId}-info`, `#${slotId}-logo-preview`, 0, true);
      slot.trigger = false;
    }
  });
}

export function updateHotkeys() {
  const src = "../common/js/hotkeys.js";
  document.querySelectorAll(`script[src="${src}"]`).forEach(s => s.remove());

  const script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}

// ------------------------
// Switches
// ------------------------
export function checkSwitches() {
  const masterSwitch = document.getElementById("painelzinhos-masterswitch")?.checked;
  window.masterSwitchIsOn = masterSwitch;
  document.getElementById("alt-main-config-content")?.classList.toggle("active", masterSwitch);

  const altSwitches = document.querySelectorAll('[id^="painelzinhos-switch"]');
  altSwitches.forEach((switchEl) => {
    const i = switchEl.id.replace("painelzinhos-switch", "");
    checkAltSwitch(i, masterSwitch);
  });
}

function checkAltSwitch(i, masterSwitch) {
  const switchEl = document.getElementById(`painelzinhos-switch${i}`);
  const configEl = document.getElementById(`alt-${i}-config-content`);
  if (!switchEl || !configEl) return;

  const activeMonitor = window[`alt_${i}_active_time_monitor`];
  const inactiveMonitor = window[`alt_${i}_inactive_time_monitor`];
  const name = window[`alt_${i}_name`];
  const info = window[`alt_${i}_info`];
  let jumpnext = window[`alt_${i}_jumpnext`];
  const autoload = window[`alt_${i}_autoload`];
  const turnoff = window[`alt_${i}_turnoff`];
  const waitingTime = window[`alt_${i}_waiting_time`];

  if (!masterSwitch) {
    configEl.className = switchEl.checked ? "inactive" : "";
    configEl.classList.remove("active");
    return;
  }

  if (switchEl.checked) {
    if (activeMonitor >= 0 && inactiveMonitor === 0 && name && info) {
      configEl.classList.add("active");
      configEl.classList.remove("inactive");
      window[`alt_${i}_jumpnext`] = true;
    } else {
      configEl.classList.add("inactive");
      configEl.classList.remove("active");
      if (autoload && jumpnext) {
        window[`alt_${i}_jumpnext`] = false;
        jumpNextSlot(`#alt-${i}-memory-slots`, `#alt-${i}-name`, `#alt-${i}-info`, `#alt-${i}-logo-preview`, waitingTime);
      }
    }
  } else {
    configEl.className = "";
    if (turnoff && autoload && jumpnext) {
      window[`alt_${i}_jumpnext`] = false;
      jumpNextSlot(`#alt-${i}-memory-slots`, `#alt-${i}-name`, `#alt-${i}-info`, `#alt-${i}-logo-preview`, waitingTime);
    }
  }
}

// ------------------------
// JumpNextSlot
// ------------------------
export function jumpNextSlot(memorySlotSelector, nameSelector, infoSelector, logoSelector, waitingTime = 0) {
  const slots = document.querySelectorAll(`${memorySlotSelector} li`);
  for (let slot of slots) {
    const nameVal = slot.querySelector(".stored-name")?.textContent || "";
    const infoVal = slot.querySelector(".stored-info")?.textContent || "";
    const logoVal = slot.querySelector(".stored-logo")?.textContent || "";

    if (!nameVal && !infoVal && !logoVal) {
      loadSlot(nameSelector, infoSelector, logoSelector, waitingTime, true);
      break;
    }
  }
}
