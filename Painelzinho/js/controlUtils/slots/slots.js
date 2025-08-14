// slots.js
function loadSlot(name, info, logo, name_to_load, info_to_load, logo_to_load, alt_waiting_time, from_hotkey = true) {
  setTimeout(() => {
    const default_logo = logo.replace("-preview", "-default");
    const default_logo_value = $(default_logo).attr("src");

    $(name + ":text").val(name_to_load);
    $(info + ":text").val(info_to_load);
    if (logo_to_load === "default") logo_to_load = default_logo_value;
    $(logo).attr("src", logo_to_load);
    refreshData();
  }, alt_waiting_time * 1000);

  const auto_trigger = name.replace("#", "").replace("-name", "-autotrigger");
  const alt_switch = name.replace("#alt-", "").replace("-name", "");

  if (from_hotkey &&
      document.getElementById(auto_trigger).checked &&
      $(`#painelzinhos-switch${alt_switch}`).is(":not(:checked)")) {
    $(`#painelzinhos-switch${alt_switch}`).prop("checked", true).change();
  }
}

// Limpar inputs
function cleanInputs(slotNum) {
  $(`#alt-${slotNum}-name:text`).val("").change();
  $(`#alt-${slotNum}-info:text`).val("").change();
  const alt_logo_default = $(`#alt-${slotNum}-logo-default`).attr("src");
  $(`#alt-${slotNum}-logo-preview`).attr("src", alt_logo_default).change();
}

// Inicializa eventos
[1,2,3,4].forEach(i => {
  $(`#alt-${i}-clean-inputs`).click(() => cleanInputs(i));
});

export { loadSlot, cleanInputs };