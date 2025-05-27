// --- Sortable com SortableJS ---
if (typeof Sortable !== "undefined") {
  const sortableEl = document.getElementById("sortable");
  const localStorageKey = "sorted";

  const saveOrder = () => {
    const order = [...sortableEl.children].map((el) => el.id).join(",");
    localStorage.setItem(localStorageKey, order);
  };

  const restoreOrder = () => {
    const savedOrder = localStorage.getItem(localStorageKey);
    if (!savedOrder) return;
    const idsOrder = savedOrder.split(",");
    const items = Array.from(sortableEl.children);

    idsOrder.reverse().forEach((id) => {
      const el = items.find((item) => item.id === id);
      if (el) sortableEl.prepend(el);
    });
  };

  Sortable.create(sortableEl, {
    handle: ".drag-handle",
    onEnd: saveOrder,
  });

  restoreOrder();
} else {
  console.warn("Biblioteca SortableJS não encontrada.");
}

// Disable seleção de texto no container sortable
document.getElementById("sortable").style.userSelect = "none";

// --- Renameable inline editing ---
document.querySelectorAll(".renameable").forEach((div) => {
  div.addEventListener("dblclick", () => {
    const originalValue = div.textContent.trim();
    div.textContent = "";

    const input = document.createElement("input");
    input.type = "text";
    input.value = originalValue;
    input.maxLength = 40;
    div.appendChild(input);
    input.focus();

    const saveInput = () => {
      div.textContent = input.value.trim() || originalValue;
    };

    input.addEventListener("change", saveInput);
    input.addEventListener("blur", saveInput);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
  });
});

// --- Função para buscar o próximo slot a carregar ---
function findNextSlot(memorySlotSelector, currentData) {
  const slots = document.querySelectorAll(`ul${memorySlotSelector} li`);
  let firstStoredSlot = null;
  let slotToLoad = null;
  let foundCurrent = false;

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const slotNumber = Number(slot.querySelector(".slot-number").textContent);
    const nameValue = slot.querySelector(".stored-name").textContent.trim();
    const infoValue = slot.querySelector(".stored-info").textContent.trim();
    const logoValue = slot.querySelector(".stored-logo").textContent.trim();

    const isEmptySlot =
      slot.querySelector(".stored-name").textContent === "" &&
      slot.querySelector(".stored-info").textContent === "" &&
      slot.querySelector(".stored-logo").textContent === "";

    const isCurrentLoaded =
      currentData.name === nameValue &&
      currentData.info === infoValue &&
      (currentData.logo === logoValue || currentData.logo.classList?.contains(logoValue));

    if (firstStoredSlot === null && !isEmptySlot) {
      firstStoredSlot = slotNumber;
    }

    if (foundCurrent) {
      if (slotNumber === currentData.slotNumber + 1 && !isEmptySlot) {
        slotToLoad = slotNumber;
        break;
      }
      if (currentData.slotNumber + 1 > 10 || isEmptySlot) {
        slotToLoad = firstStoredSlot;
        break;
      }
    }

    if (isCurrentLoaded) {
      foundCurrent = true;
      currentData.slotNumber = slotNumber;
    }
  }

  return slotToLoad;
}

function jumpNextSlot(memorySlotSelector, nameSelector, infoSelector, logoSelector, altWaitingTime) {
  // Coletando dados atuais carregados
  const nameLoaded = document.querySelector(`${nameSelector}:text`)?.value || "";
  const infoLoaded = document.querySelector(`${infoSelector}:text`)?.value || "";
  const logoLoaded = document.querySelector(logoSelector)?.src || "";

  const currentData = {
    name: nameLoaded,
    info: infoLoaded,
    logo: document.querySelector(logoSelector),
    slotNumber: null,
  };

  const nextSlotNum = findNextSlot(memorySlotSelector, currentData);

  if (!nextSlotNum) return;

  const slot = document.querySelector(`ul${memorySlotSelector} li:nth-child(${nextSlotNum})`);
  if (!slot) return;

  const nameToLoad = slot.querySelector(".stored-name").textContent;
  const infoToLoad = slot.querySelector(".stored-info").textContent;
  const logoToLoad = slot.querySelector(".stored-logo").textContent;

  loadSlot(nameSelector, infoSelector, logoSelector, nameToLoad, infoToLoad, logoToLoad, altWaitingTime, false);

  slot.classList.add("next-to-load");
}

function loadSlot(name, info, logo, nameToLoad, infoToLoad, logoToLoad, altWaitingTime, fromHotkey = true) {
  setTimeout(() => {
    const defaultLogoSelector = logo.replace("-preview", "-default");
    const defaultLogoValue = document.querySelector(defaultLogoSelector)?.src || "";

    document.querySelector(`${name}:text`).value = nameToLoad;
    document.querySelector(`${info}:text`).value = infoToLoad;

    if (logoToLoad === "default") {
      logoToLoad = defaultLogoValue;
    }
    document.querySelector(logo).src = logoToLoad;

    refreshData();
  }, altWaitingTime * 1000);

  if (fromHotkey) {
    const autoTriggerId = name.replace("#", "").replace("-name", "-autotrigger");
    const altSwitchNum = name.replace("#alt-", "").replace("-name", "");

    const autoTriggerElem = document.getElementById(autoTriggerId);
    const lowerThirdsSwitch = document.getElementById(`lower-thirds-switch${altSwitchNum}`);

    if (autoTriggerElem?.checked && lowerThirdsSwitch && !lowerThirdsSwitch.checked) {
      lowerThirdsSwitch.checked = true;
      lowerThirdsSwitch.dispatchEvent(new Event("change"));
    }
  }
}

function clearAltInputs(altNum) {
  document.querySelector(`#alt-${altNum}-name:text`).value = "";
  document.querySelector(`#alt-${altNum}-name:text`).dispatchEvent(new Event("change"));

  document.querySelector(`#alt-${altNum}-info:text`).value = "";
  document.querySelector(`#alt-${altNum}-info:text`).dispatchEvent(new Event("change"));

  const defaultLogoSrc = document.querySelector(`#alt-${altNum}-logo-default`)?.src;
  if (defaultLogoSrc) {
    const logoPreview = document.querySelector(`#alt-${altNum}-logo-preview`);
    logoPreview.src = defaultLogoSrc;
    logoPreview.dispatchEvent(new Event("change"));
  }
}

// Bind dos 4 botões de limpar inputs
[1, 2, 3, 4].forEach((num) => {
  document.getElementById(`alt-${num}-clean-inputs`).addEventListener("click", () => clearAltInputs(num));
});

document.getElementById("toggle-preview").addEventListener("click", () => {
  const toggleBtn = document.getElementById("toggle-preview");
  const preview = document.getElementById("alt-preview");
  const panel = document.getElementById("alt-panel");

  toggleBtn.classList.toggle("active");
  preview.classList.toggle("active");

  panel.style.marginBottom = panel.style.marginBottom === "0px" ? "220px" : "0px";
});
