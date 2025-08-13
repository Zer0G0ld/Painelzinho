// memory-slots.js

export function checkSlots(memory_slot, name, info, logo) {
  $("ul" + memory_slot + " li").each(function () {
    const slotEl = document.getElementById($(this).attr("id"));
    const nameEl = $(this).children(".stored-name");
    const infoEl = $(this).children(".stored-info");
    const logoEl = $(this).children(".stored-logo");
    const isDefaultLogo = $(logo).hasClass("default");

    const nameVal = nameEl.text();
    const infoVal = infoEl.text();
    const logoVal = logoEl.text();

    if (nameVal && infoVal && !logoVal) logoEl.text("default");

    if (!nameEl.text() && !infoEl.text() && !logoEl.text()) slotEl.classList.remove("stored");
    else slotEl.classList.add("stored");

    if (
      $(name).val() === nameVal &&
      $(info).val() === infoVal &&
      ($(logo).attr("src") === logoVal || (isDefaultLogo && logoVal === "default"))
    ) {
      if (nameVal && infoVal && logoVal) {
        slotEl.classList.add("active-slot");
        slotEl.classList.remove("next-to-load");
      }
    } else {
      slotEl.classList.remove("active-slot");
    }

    if (logoVal && logoVal !== "default") slotEl.classList.add("custom-logo");
    else slotEl.classList.remove("custom-logo");
  });
}

export function memorySlotsSystem(memory_slot, name, info, logo) {
  let slot_id, name_id, info_id, logo_id, default_logo, is_default_logo;
  
  $("ul" + memory_slot + " li")
    .mousedown(function () {
      slot_id = $(this).attr("id");
      name_id = $(this).children(".stored-name").attr("id");
      info_id = $(this).children(".stored-info").attr("id");
      logo_id = $(this).children(".stored-logo").attr("id");
      default_logo = logo.replace("-preview", "-default");
      is_default_logo = $(logo).attr("src") === $(default_logo).attr("src");

      clearTimeout(this.downTimer);
      this.downTimer = setTimeout(() => {
        document.getElementById(slot_id).classList.add("delete");
        $("#" + name_id)[0].innerHTML = "";
        $("#" + info_id)[0].innerHTML = "";
        $("#" + logo_id)[0].innerHTML = "";
        slotDeleted = true;
      }, 600);
    })
    .mouseup(function () {
      clearTimeout(this.downTimer);
      document.getElementById(slot_id).classList.remove("delete");

      if (!slotDeleted) {
        if ($("#" + name_id).is(":empty") && $("#" + info_id).is(":empty") && $("#" + logo_id).is(":empty")) {
          // Save
          const nameToSave = $(name + ":text").val();
          const infoToSave = $(info + ":text").val();
          const logoToSave = $(logo).attr("src");

          if (nameToSave && infoToSave) {
            $("#" + name_id)[0].innerHTML = nameToSave;
            $("#" + info_id)[0].innerHTML = infoToSave;
            $("#" + logo_id)[0].innerHTML = is_default_logo ? "default" : logoToSave;
          }
        } else {
          // Load
          const nameToLoad = $(this).children("#" + name_id).text();
          const infoToLoad = $(this).children("#" + info_id).text();
          const logoToLoad = $(this).children("#" + logo_id).text();
          const defaultLogoSrc = $(default_logo).attr("src");

          $(name + ":text").val(nameToLoad).change();
          $(info + ":text").val(infoToLoad).change();
          $(logo).attr("src", logoToLoad === "default" ? defaultLogoSrc : logoToLoad).change();

          // Auto trigger
          const slotNumber = $(this).children(".slot-number").text();
          const auto_trigger = slot_id.replace(`-slot-${slotNumber}`, "-autotrigger");
          let altSwitch = slot_id.replace("alt-", "").replace(`-slot-${slotNumber}`, "");

          if (document.getElementById(auto_trigger).checked && $("#painelzinhos-switch" + altSwitch).is(":not(:checked)")) {
            $("#painelzinhos-switch" + altSwitch).prop("checked", true).change();
          }
        }
      } else {
        slotDeleted = false;
      }
    });
}

// Inicialização de todos os memory slots
export function initMemorySlots() {
  memorySlotsSystem("#alt-1-memory-slots", "#alt-1-name", "#alt-1-info", "#alt-1-logo-preview");
  memorySlotsSystem("#alt-2-memory-slots", "#alt-2-name", "#alt-2-info", "#alt-2-logo-preview");
  memorySlotsSystem("#alt-3-memory-slots", "#alt-3-name", "#alt-3-info", "#alt-3-logo-preview");
  memorySlotsSystem("#alt-4-memory-slots", "#alt-4-name", "#alt-4-info", "#alt-4-logo-preview");
}
