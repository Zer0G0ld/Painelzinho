function updateHotkeys() {
  const src = "../js/hotkeys.js";
  const selector = `script[src="${src}"]`;

  // Remove o script antigo
  document.querySelectorAll(selector).forEach((el) => el.remove());

  // Cria e adiciona o script atualizado
  const script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}

function toggleSwitchIfHotkeyChanged(hotkey, hotkeyOld, switchId) {
  if (hotkey !== hotkeyOld) {
    const checkbox = document.getElementById(switchId);
    if (checkbox) {
      $(checkbox).prop("checked", !checkbox.checked).change();
    }
    return hotkey; // atualiza o valor old
  }
  return hotkeyOld;
}

function loadMemorySlotIfHotkeyChanged(
  hotkey,
  hotkeyOld,
  altNumber,
  slotNumber
) {
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
  // Toggle switches
  hotkeyMasterSwitchOld = toggleSwitchIfHotkeyChanged(
    hotkeyMasterSwitch,
    hotkeyMasterSwitchOld,
    "lower-thirds-masterswitch"
  );
  hotkeySwitch1Old = toggleSwitchIfHotkeyChanged(
    hotkeySwitch1,
    hotkeySwitch1Old,
    "lower-thirds-switch1"
  );
  hotkeySwitch2Old = toggleSwitchIfHotkeyChanged(
    hotkeySwitch2,
    hotkeySwitch2Old,
    "lower-thirds-switch2"
  );
  hotkeySwitch3Old = toggleSwitchIfHotkeyChanged(
    hotkeySwitch3,
    hotkeySwitch3Old,
    "lower-thirds-switch3"
  );
  hotkeySwitch4Old = toggleSwitchIfHotkeyChanged(
    hotkeySwitch4,
    hotkeySwitch4Old,
    "lower-thirds-switch4"
  );

  // Memory slots LT1
  for (let i = 1; i <= 10; i++) {
    const hotkeyVar = eval(`hotkeyAlt1Slot${i}`);
    const hotkeyOldVar = eval(`hotkeyAlt1Slot${i}Old`);

    // Especial para slot 1 que tem verificação extra:
    if (i === 1) {
      if (hotkeyVar !== hotkeyOldVar) {
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
        eval(`hotkeyAlt1Slot1Old = hotkeyAlt1Slot1`);
      }
    } else {
      const newOld = loadMemorySlotIfHotkeyChanged(
        hotkeyVar,
        hotkeyOldVar,
        1,
        i
      );
      eval(`hotkeyAlt1Slot${i}Old = newOld`);
    }
  }

  // Memory slots LT2
  for (let i = 1; i <= 10; i++) {
    const hotkeyVar = eval(`hotkeyAlt2Slot${i}`);
    const hotkeyOldVar = eval(`hotkeyAlt2Slot${i}Old`);
    const newOld = loadMemorySlotIfHotkeyChanged(hotkeyVar, hotkeyOldVar, 2, i);
    eval(`hotkeyAlt2Slot${i}Old = newOld`);
  }

  // Memory slots LT3
  for (let i = 1; i <= 10; i++) {
    const hotkeyVar = eval(`hotkeyAlt3Slot${i}`);
    const hotkeyOldVar = eval(`hotkeyAlt3Slot${i}Old`);
    const newOld = loadMemorySlotIfHotkeyChanged(hotkeyVar, hotkeyOldVar, 3, i);
    eval(`hotkeyAlt3Slot${i}Old = newOld`);
  }
}

// Helper para mostrar/ocultar elementos
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

  // Config OK button
  document
    .querySelectorAll(".btn-ok")
    .forEach((btn) =>
      btn.setAttribute(
        "onclick",
        `okLogoPopup('${logoId}', '${logoDefaultId}')`
      )
    );

  // Show/hide remove button
  const removeBtn = document.querySelector(".btn-remove");
  if (removeBtn) {
    removeBtn.style.display = logoId === logoDefaultId ? "none" : "block";
  }
}

function okLogoPopup(logoId, logoDefaultId) {
  const fileInput = document.getElementById("logo-file");
  const file = fileInput?.files[0];
  const popupPreviewSrc =
    document.getElementById("logo-file-preview")?.src || "";
  const preview = document.getElementById(logoId);
  const altLogoPreviewId = logoDefaultId.replace("-default", "-preview");
  const altLogoPreview = document.getElementById(altLogoPreviewId);

  if (file) {
    const newSrc = `../logos/${file.name}`;
    if (preview) {
      preview.src = newSrc;
      preview.dispatchEvent(new Event("change"));
    }

    // Se o logo atual é default e o alternativo está com classe "default", atualiza ele também
    if (
      logoId === logoDefaultId &&
      altLogoPreview?.classList.contains("default")
    ) {
      altLogoPreview.src = newSrc;
      altLogoPreview.dispatchEvent(new Event("change"));
    }
  } else {
    if (!popupPreviewSrc) {
      const defaultSrc = document.getElementById(logoDefaultId)?.src;
      if (preview && defaultSrc) {
        preview.src = defaultSrc;
        preview.dispatchEvent(new Event("change"));
      }
    }
  }

  toggleVisibility("select-image", false);
}

function cancelLogoPopup() {
  toggleVisibility("select-image", false);
}

function removeLogoPopup() {
  const preview = document.getElementById("logo-file-preview");
  const container = document.getElementById("file-preview");
  const fileInput = document.getElementById("logo-file");

  if (container) container.classList.add("no-image");
  if (fileInput) fileInput.value = "";
  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }
}

// Função para verificar se cada logo preview está com a imagem default
function checkLogos() {
  document.querySelectorAll(".alt-logo-preview").forEach((logoPreview) => {
    const id = logoPreview.id;
    const defaultId = id.replace("-preview", "-default");
    const defaultLogo = document.getElementById(defaultId);

    if (!defaultLogo) return;

    const isDefault = logoPreview.src === defaultLogo.src;
    logoPreview.classList.toggle("default", isDefault);
  });
}

// Sistema de Memory Slots
function checkSlots(memorySlotSelector, nameInput, infoInput, logoElement) {
  const slots = document.querySelectorAll(`ul${memorySlotSelector} li`);

  slots.forEach((slot) => {
    const storedNameEl = slot.querySelector(".stored-name");
    const storedInfoEl = slot.querySelector(".stored-info");
    const storedLogoEl = slot.querySelector(".stored-logo");

    const nameValue = storedNameEl?.textContent || "";
    const infoValue = storedInfoEl?.textContent || "";
    let logoValue = storedLogoEl?.textContent || "";

    // Se não tiver logo, definir como "default"
    if (nameValue && infoValue && !logoValue) {
      if (storedLogoEl) storedLogoEl.textContent = "default";
      logoValue = "default";
    }

    // Marca slot como armazenado se tiver dados, senão remove a classe
    slot.classList.toggle(
      "stored",
      !(
        storedNameEl?.textContent === "" &&
        storedInfoEl?.textContent === "" &&
        storedLogoEl?.textContent === ""
      )
    );

    // Verifica se o slot está ativo
    const isDefaultLogo = logoElement.classList.contains("default");
    const nameMatches = nameInput.value === nameValue;
    const infoMatches = infoInput.value === infoValue;
    const logoMatches =
      logoElement.src === logoValue ||
      (isDefaultLogo && logoValue === "default");

    if (
      nameMatches &&
      infoMatches &&
      logoMatches &&
      nameValue &&
      infoValue &&
      logoValue
    ) {
      slot.classList.add("active-slot");
      slot.classList.remove("next-to-load");
    } else {
      slot.classList.remove("active-slot");
    }

    // Marca se o slot tem logo customizado
    slot.classList.toggle("custom-logo", logoValue && logoValue !== "default");
  });
}

function memorySlotsSystem(
  memorySlotSelector,
  nameSelector,
  infoSelector,
  logoSelector
) {
  let slotDeleted = false;
  const defaultLogoSelector = logoSelector.replace("-preview", "-default");

  // Delegação de evento para melhor performance e evitar múltiplos handlers
  document
    .querySelector(`ul${memorySlotSelector}`)
    .addEventListener("mousedown", (event) => {
      const li = event.target.closest("li");
      if (!li) return;

      // IDs e elementos relacionados ao slot clicado
      const slotId = li.id;
      const nameEl = li.querySelector(".stored-name");
      const infoEl = li.querySelector(".stored-info");
      const logoEl = li.querySelector(".stored-logo");
      if (!nameEl || !infoEl || !logoEl) return;

      const isDefaultLogo =
        document.querySelector(logoSelector).src ===
        document.querySelector(defaultLogoSelector).src;

      // Timer para detectar "press and hold" (600ms)
      clearTimeout(li.downTimer);
      li.downTimer = setTimeout(() => {
        // Marcar como deletado
        li.classList.add("delete");
        nameEl.textContent = "";
        infoEl.textContent = "";
        logoEl.textContent = "";
        slotDeleted = true;
      }, 600);
    });

  document
    .querySelector(`ul${memorySlotSelector}`)
    .addEventListener("mouseup", (event) => {
      const li = event.target.closest("li");
      if (!li) return;

      clearTimeout(li.downTimer);
      li.classList.remove("delete");

      if (!slotDeleted) {
        const nameEl = li.querySelector(".stored-name");
        const infoEl = li.querySelector(".stored-info");
        const logoEl = li.querySelector(".stored-logo");
        if (!nameEl || !infoEl || !logoEl) return;

        const nameEmpty = !nameEl.textContent.trim();
        const infoEmpty = !infoEl.textContent.trim();
        const logoEmpty = !logoEl.textContent.trim();

        const nameInput = document.querySelector(nameSelector);
        const infoInput = document.querySelector(infoSelector);
        const logoImg = document.querySelector(logoSelector);

        if (nameEmpty && infoEmpty && logoEmpty) {
          // Salvar dados se inputs têm valores
          const nameToSave = nameInput.value.trim();
          const infoToSave = infoInput.value.trim();
          const logoSrc = logoImg.src;
          const defaultLogoSrc =
            document.querySelector(defaultLogoSelector).src;

          if (nameToSave && infoToSave) {
            nameEl.textContent = nameToSave;
            infoEl.textContent = infoToSave;
            logoEl.textContent =
              logoSrc === defaultLogoSrc ? "default" : logoSrc;
          }
        } else {
          // Carregar dados do slot para os inputs
          const nameToLoad = nameEl.textContent.trim();
          const infoToLoad = infoEl.textContent.trim();
          const logoToLoad = logoEl.textContent.trim();
          const defaultLogoSrc =
            document.querySelector(defaultLogoSelector).src;

          nameInput.value = nameToLoad;
          infoInput.value = infoToLoad;

          if (logoToLoad === "default") {
            logoImg.src = defaultLogoSrc;
          } else {
            logoImg.src = logoToLoad;
          }

          // Disparar eventos de mudança
          nameInput.dispatchEvent(new Event("change"));
          infoInput.dispatchEvent(new Event("change"));
          logoImg.dispatchEvent(new Event("change"));

          // Lógica para ativar o painel se auto-trigger estiver ativo
          const slotNumber =
            li.querySelector(".slot-number")?.textContent || "";
          const autoTriggerId = slotId.replace(
            `-slot-${slotNumber}`,
            "-autotrigger"
          );
          const altSwitchId = slotId
            .replace("alt-", "")
            .replace(`-slot-${slotNumber}`, "");
          const autoTriggerCheckbox = document.getElementById(autoTriggerId);
          const lowerThirdsSwitch = document.getElementById(
            `lower-thirds-switch${altSwitchId}`
          );

          if (
            autoTriggerCheckbox?.checked &&
            lowerThirdsSwitch &&
            !lowerThirdsSwitch.checked
          ) {
            lowerThirdsSwitch.checked = true;
            lowerThirdsSwitch.dispatchEvent(new Event("change"));
          }
        }
      } else {
        slotDeleted = false;
      }
    });
}
for (let i = 1; i <= 4; i++) {
  memorySlotsSystem(
    `#alt-${i}-memory-slots`,
    `#alt-${i}-name`,
    `#alt-${i}-info`,
    `#alt-${i}-logo-preview`
  );
}
