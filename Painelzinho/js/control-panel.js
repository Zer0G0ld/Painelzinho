// importa todos os módulos do controlUtils
import * as controlUtils from './controlUtils/index.js';

function checkAltSwitch(i, masterSwitch) {
  const switchEl = document.getElementById(`painelzinhos-switch${i}`);
  const configEl = document.getElementById(`alt-${i}-config-content`);

  // Pega as variáveis globais dinamicamente
  const activeMonitor = window[`alt_${i}_active_time_monitor`];
  const inactiveMonitor = window[`alt_${i}_inactive_time_monitor`];
  const name = window[`alt_${i}_name`];
  const info = window[`alt_${i}_info`];
  let jumpnext = window[`alt_${i}_jumpnext`];
  const autoload = window[`alt_${i}_autoload`];
  const turnoff = window[`alt_${i}_turnoff`];
  const waitingTime = window[`alt_${i}_waiting_time`];

  if (!masterSwitch) {
    // Main switch OFF → inativo ou off
    if (switchEl.checked) {
      configEl.classList.add("inactive");
      configEl.classList.remove("active");
    } else {
      configEl.className = "";
    }
    return;
  }

  // Main switch ON
  if (switchEl.checked) {
    if (activeMonitor >= 0 && inactiveMonitor === 0 && name && info) {
      configEl.classList.add("active");
      configEl.classList.remove("inactive");
      window[`alt_${i}_jumpnext`] = true;
    } else {
      configEl.classList.remove("active");
      configEl.classList.add("inactive");

      if (autoload && jumpnext) {
        window[`alt_${i}_jumpnext`] = false;
        jumpNextSlot(
          `#alt-${i}-memory-slots`,
          `#alt-${i}-name`,
          `#alt-${i}-info`,
          `#alt-${i}-logo-preview`,
          waitingTime
        );
      }
    }
  } else {
    configEl.className = "";
    if (turnoff && autoload && jumpnext) {
      window[`alt_${i}_jumpnext`] = false;
      jumpNextSlot(
        `#alt-${i}-memory-slots`,
        `#alt-${i}-name`,
        `#alt-${i}-info`,
        `#alt-${i}-logo-preview`,
        waitingTime
      );
    }
  }
}

function checkSwitches() {
  const masterSwitch = document.getElementById("painelzinhos-masterswitch").checked;
  masterSwitchIsOn = masterSwitch;

  // ativa/desativa o container principal
  document.getElementById("alt-main-config-content")
    .classList.toggle("active", masterSwitch);

  // loop pelos ALTs
  for (let i = 1; i <= 4; i++) {
    checkAltSwitch(i, masterSwitch);
  }
}


const altSelectors = Array.from({ length: 4 }, (_, i) => i + 1);
const periodicTasks = [checkHotkeys, updateHotkeys /* outras tarefas */];

function refreshData() {
  console.log("refreshData");

  checkLogos();

  altSelectors.forEach(i => {
    checkSlots(
      `#alt-${i}-memory-slots`,
      `#alt-${i}-name`,
      `#alt-${i}-info`,
      `#alt-${i}-logo-preview`
    );
  });

  getAppearance();
  checkSwitches();
  function_send();
}


function checkUpdates() {
  periodicTasks.forEach(task => task());
}


// inicializações
controlUtils.settingsTooltips();
controlUtils.loadDefaultValues();
controlUtils.loadData();
controlUtils.updateCustomFontList();
controlUtils.refreshData();
controlUtils.checkSwitches();
controlUtils.saveData();

setInterval(() => {
  controlUtils.checkHotkeys();
  controlUtils.updateHotkeys();
}, 200);

// ready
$(document).ready(() => $("#defaultTab").click());
