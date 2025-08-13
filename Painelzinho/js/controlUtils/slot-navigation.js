// Função para pular para o próximo slot armazenado
export function jumpNextSlot(memory_slot, name, info, logo, alt_waiting_time) {
  let find_next = false;
  let find_first = false;
  let first_stored_slot;
  let next_slot_num;
  let to_load = 0;

  const name_loaded = $(name + ":text").val();
  const info_loaded = $(info + ":text").val();
  const logo_loaded = $(logo).attr("src");

  $("ul" + memory_slot + " li").each(function () {
    const name_id = $(this).children(".stored-name").attr("id");
    const info_id = $(this).children(".stored-info").attr("id");
    const logo_id = $(this).children(".stored-logo").attr("id");
    const name_value = $(this).children(".stored-name").text();
    const info_value = $(this).children(".stored-info").text();
    const logo_value = $(this).children(".stored-logo").text();
    const slot_number = Number($(this).children(".slot-number").text());

    const loadedSlot =
      name_loaded === name_value &&
      info_loaded === info_value &&
      (logo_loaded === logo_value || $(logo).hasClass(logo_value));

    const emptySlot =
      $("#" + name_id).is(":empty") &&
      $("#" + info_id).is(":empty") &&
      $("#" + logo_id).is(":empty");

    if (!find_first && !emptySlot) {
      find_first = true;
      first_stored_slot = slot_number;
    }

    if (loadedSlot) {
      find_next = true;
      next_slot_num = slot_number + 1;
    }

    if (find_next && slot_number === next_slot_num && !emptySlot) {
      find_next = false;
      to_load = slot_number;
    }
    if (find_next && (next_slot_num > 10 || emptySlot)) {
      find_next = false;
      to_load = first_stored_slot;
    }
  });

  if (to_load && to_load > 0) {
    $("ul" + memory_slot + " li:nth-child(" + to_load + ")").each(function () {
      const slot_id = $(this).attr("id");
      const name_id = $(this).children(".stored-name").attr("id");
      const info_id = $(this).children(".stored-info").attr("id");
      const logo_id = $(this).children(".stored-logo").attr("id");

      const name_to_load = $(this).children("#" + name_id).text();
      const info_to_load = $(this).children("#" + info_id).text();
      const logo_to_load = $(this).children("#" + logo_id).text();

      loadSlot(
        name,
        info,
        logo,
        name_to_load,
        info_to_load,
        logo_to_load,
        alt_waiting_time,
        false
      );

      $("#" + slot_id).addClass("next-to-load");
    });
  }
}
