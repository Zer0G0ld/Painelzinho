// memory-slots.js
import { hotkeys } from "../hotkeys/hotkeys";

function checkSlots(memory_slot, name, info, logo) {
  $(`ul${memory_slot} li`).each(function () {
    const slotKey = $(this).attr("id").replace(/-/g, "").toUpperCase();
    const value = hotkeys.slots[slotKey] || 0;

    $(this).toggleClass("active-slot", value === 1);

    const nameEl = $(this).children(".stored-name");
    const infoEl = $(this).children(".stored-info");
    const logoEl = $(this).children(".stored-logo");

    $(this).toggleClass("stored", !!(nameEl.text() || infoEl.text() || logoEl.text()));
  });
}

function memorySlotsSystem(memory_slot, name, info, logo) {
  $(`ul${memory_slot} li`).each(function () {
    let downTimer;
    let slotDeleted = false;
    const $slot = $(this);
    const slotId = $slot.attr("id");
    const slotKey = slotId.replace(/-/g, "").toUpperCase();
    const nameEl = $slot.children(".stored-name");
    const infoEl = $slot.children(".stored-info");
    const logoEl = $slot.children(".stored-logo");
    const default_logo = logo.replace("-preview", "-default");

    $slot.on("mousedown", () => {
      clearTimeout(downTimer);
      downTimer = setTimeout(() => {
        $slot.addClass("delete");
        nameEl.text("");
        infoEl.text("");
        logoEl.text("");
        hotkeys.slots[slotKey] = 0; // marca como vazio
        slotDeleted = true;
      }, 600);
    });

    $slot.on("mouseup", () => {
      clearTimeout(downTimer);
      $slot.removeClass("delete");

      if (!slotDeleted) {
        const nameVal = $(name + ":text").val();
        const infoVal = $(info + ":text").val();
        const logoVal = $(logo).attr("src");

        if (nameVal && infoVal) {
          nameEl.text(nameVal);
          infoEl.text(infoVal);
          logoEl.text(logoVal.includes("default") ? "default" : logoVal);
          hotkeys.slots[slotKey] = 1; // marca como ativo
        } else {
          // Carrega dados do slot
          $(name + ":text").val(nameEl.text()).change();
          $(info + ":text").val(infoEl.text()).change();
          $(logo).attr("src", logoEl.text() === "default" ? $(default_logo).attr("src") : logoEl.text()).change();
        }
      } else {
        slotDeleted = false;
      }
    });
  });
}

function initMemorySlots() {
  for (let i = 1; i <= 4; i++) {
    memorySlotsSystem(`#alt-${i}-memory-slots`, `#alt-${i}-name`, `#alt-${i}-info`, `#alt-${i}-logo-preview`);
  }
}

export { checkSlots, memorySlotsSystem, initMemorySlots };
