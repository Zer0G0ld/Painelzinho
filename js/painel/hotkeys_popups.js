// --------------------- HOTKEYS MANAGEMENT ---------------------

// Objeto para armazenar hotkeys e seus valores antigos (states)
const hotkeysState = {
  masterSwitch: { current: hotkeyMasterSwitch, old: hotkeyMasterSwitchOld, switchId: "lower-thirds-masterswitch" },
  switch1: { current: hotkeySwitch1, old: hotkeySwitch1Old, switchId: "lower-thirds-switch1" },
  switch2: { current: hotkeySwitch2, old: hotkeySwitch2Old, switchId: "lower-thirds-switch2" },
  switch3: { current: hotkeySwitch3, old: hotkeySwitch3Old, switchId: "lower-thirds-switch3" },
  switch4: { current: hotkeySwitch4, old: hotkeySwitch4Old, switchId: "lower-thirds-switch4" },

  alt1Slots: [],
  alt2Slots: [],
  alt3Slots: [],
};

// Inicializar os arrays de slots para alt1, alt2 e alt3
for (let i = 1; i <= 10; i++) {
  hotkeysState.alt1Slots.push({ current: window[`hotkeyAlt1Slot${i}`], old: window[`hotkeyAlt1Slot${i}Old`] });
  hotkeysState.alt2Slots.push({ current: window[`hotkeyAlt2Slot${i}`], old: window[`hotkeyAlt2Slot${i}Old`] });
  hotkeysState.alt3Slots.push({ current: window[`hotkeyAlt3Slot${i}`], old: window[`hotkeyAlt3Slot${i}Old`] });
}

function updateHotkeysScript() {
  const src = "../js/hotkeys.js";
  const selector = `script[src="${src}"]`;

  document.querySelectorAll(selector).forEach(el => el.remove());

  const script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}

function toggleSwitchIfChanged(hotkey, hotkeyOld, switchId) {
  if (hotkey !== hotkeyOld) {
    const checkbox = document.getElementById(switchId);
    if (checkbox) {
      $(checkbox).prop("checked", !checkbox.checked).change();
    }
    return hotkey;
  }
  return hotkeyOld;
}

function loadMemorySlotIfChanged(hotkey, hotkeyOld, altNumber, slotNumber) {
  if (hotkey !== hotkeyOld) {
    loadSlot(
      `#alt-${altNumber}-name`,
      `#alt-${altNumber}-info`,
      `#alt-${altNumber}-logo-preview`,
      $(`#alt-${altNumber}-name-${slotNumber}`).text(),
      $(`#alt-${altNumber}-info-${slotNumber}`).text(),
      $(`#alt-${altNumber}-logo-${slotNumber}`).text(),
      0
    );
    return hotkey;
  }
  return hotkeyOld;
}

function checkHotkeys() {
  // Atualizar switches master e individuais
  for (const key of ["masterSwitch", "switch1", "switch2", "switch3", "switch4"]) {
    const { current, old, switchId } = hotkeysState[key];
    const newOld = toggleSwitchIfChanged(current, old, switchId);
    hotkeysState[key].old = newOld;
  }

  // Slots ALT1 (com exceção do slot 1 que tem tratamento especial)
  for (let i = 1; i <= 10; i++) {
    let slot = hotkeysState.alt1Slots[i - 1];
    if (i === 1) {
      if (slot.current !== slot.old) {
        if ($("#alt-1-name-1").text() && $("#alt-1-info-1").text()) {
          loadSlot(
            "#alt-1-name",
            "#alt-1-info",
            "#alt-1-logo-preview",
            $("#alt-1-name-1").text(),
            $("#alt-1-info-1").text(),
            $("#alt-1-logo-1").text(),
            0
          );
        }
        slot.old = slot.current;
      }
    } else {
      slot.old = loadMemorySlotIfChanged(slot.current, slot.old, 1, i);
    }
  }

  // Slots ALT2 e ALT3 (mesmo padrão)
  for (let i = 1; i <= 10; i++) {
    hotkeysState.alt2Slots[i - 1].old = loadMemorySlotIfChanged(
      hotkeysState.alt2Slots[i - 1].current,
      hotkeysState.alt2Slots[i - 1].old,
      2,
      i
    );
    hotkeysState.alt3Slots[i - 1].old = loadMemorySlotIfChanged(
      hotkeysState.alt3Slots[i - 1].current,
      hotkeysState.alt3Slots[i - 1].old,
      3,
      i
    );
  }

  // Atualizar as variáveis globais antigas também para compatibilidade (se necessário)
  hotkeyMasterSwitchOld = hotkeysState.masterSwitch.old;
  hotkeySwitch1Old = hotkeysState.switch1.old;
  hotkeySwitch2Old = hotkeysState.switch2.old;
  hotkeySwitch3Old = hotkeysState.switch3.old;
  hotkeySwitch4Old = hotkeysState.switch4.old;
  for (let i = 1; i <= 10; i++) {
    window[`hotkeyAlt1Slot${i}Old`] = hotkeysState.alt1Slots[i - 1].old;
    window[`hotkeyAlt2Slot${i}Old`] = hotkeysState.alt2Slots[i - 1].old;
    window[`hotkeyAlt3Slot${i}Old`] = hotkeysState.alt3Slots[i - 1].old;
  }
}

// --------------------- UI HELPERS ---------------------

const toggleVisibility = (id, show) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("hide", !show);
};

// ------- Reset Popup -------
function openResetPopup() {
  toggleVisibility("reset-all", true);
}

function okResetPopup() {
  localStorage.clear();

  const logosDefaults = {
    "alt-1-logo-preview": alt_1_logo_default,
    "alt-1-logo-default": alt_1_logo_default,
    "alt-2-logo-preview": alt_2_logo_default,
    "alt-2-logo-default": alt_2_logo_default,
    "alt-3-logo-preview": alt_3_logo_default,
    "alt-3-logo-default": alt_3_logo_default,
    "alt-4-logo-preview": alt_4_logo_default,
    "alt-4-logo-default": alt_4_logo_default,
  };

  Object.entries(logosDefaults).forEach(([id, value]) => {
    localStorage.setItem(id, value);
  });

  location.reload();
}

function cancelResetPopup() {
  toggleVisibility("reset-all", false);
}

// ------- Export Popup -------
function openExportPopup() {
  toggleVisibility("export-data", true);
}

function okExportPopup() {
  toggleVisibility("export-data", false);
}

// ------- Logo Preview -------
function showPreview(input) {
  if (input.files && input.files[0]) {
    const src = URL.createObjectURL(input.files[0]);
    const preview = document.getElementById("logo-file-preview");
    const container = document.getElementById("file-preview");

    container.classList.remove("no-image");
    preview.src = src;
    preview.style.display = "block";
  }
}

// ------- Logo Popup -------
function openLogoPopup(logoId, logoDefaultId) {
  toggleVisibility("select-image", true);

  const preview = document.getElementById("logo-file-preview");
  const previewToChange = document.getElementById(logoId)?.src || "";

  preview.src = previewToChange;
  preview.style.display = "block";

  const fileInput = document.getElementById("logo-file");
  if (fileInput) fileInput.value = "";

  document.querySelectorAll(".btn-ok").forEach(btn =>
    btn.setAttribute("onclick", `okLogoPopup('${logoId}', '${logoDefaultId}')`)
  );

  const removeBtn = document.querySelector(".btn-remove");
  if (removeBtn) {
    removeBtn.style.display = logoId === logoDefaultId ? "none" : "block";
  }
}

function okLogoPopup(logoId, logoDefaultId) {
  const fileInput = document.getElementById("logo-file");
  const file = fileInput?.files[0];
  const preview = document.getElementById(logoId);
  const altLogoPreviewId = logoDefaultId.replace("-default", "-preview");
  const altLogoPreview = document.getElementById(altLogoPreviewId);

  if (file) {
    const newSrc = `../logos/${file.name}`;
    if (preview) {
      preview.src = newSrc;
      preview.dispatchEvent(new Event("change"));
    }

    if (
      logoId === logoDefaultId &&
      altLogoPreview?.classList.contains("default")
    ) {
      altLogoPreview.src = newSrc;
      altLogoPreview.classList.remove("default");
    }

    localStorage.setItem(logoId, newSrc);
  }

  toggleVisibility("select-image", false);
}

function removeLogoPopup(logoId, logoDefaultId) {
  const defaultSrc = document.getElementById(logoDefaultId)?.src || "";
  const preview = document.getElementById(logoId);
  const altLogoPreviewId = logoDefaultId.replace("-default", "-preview");
  const altLogoPreview = document.getElementById(altLogoPreviewId);

  if (preview) {
    preview.src = defaultSrc;
    preview.dispatchEvent(new Event("change"));
  }

  if (altLogoPreview) {
    altLogoPreview.src = defaultSrc;
    altLogoPreview.classList.add("default");
  }

  localStorage.removeItem(logoId);
  toggleVisibility("select-image", false);
}

// ------------------------------------------------------------
// Event delegation to close popups when clicking outside content
document.getElementById("reset-all")?.addEventListener("click", e => {
  if (e.target.id === "reset-all") cancelResetPopup();
});
document.getElementById("export-data")?.addEventListener("click", e => {
  if (e.target.id === "export-data") okExportPopup();
});
document.getElementById("select-image")?.addEventListener("click", e => {
  if (e.target.id === "select-image") toggleVisibility("select-image", false);
});
