
////////////////////

//////////////////



//////////////////

// --- Sortable com SortableJS (substituindo jQuery UI Sortable) ---
// Assumindo que você pode usar a biblioteca SortableJS (https://sortablejs.github.io/Sortable/)

if (typeof Sortable !== "undefined") {
  const sortableEl = document.getElementById("sortable");
  const localStorageKey = "sorted";

  const sortable = Sortable.create(sortableEl, {
    handle: ".drag-handle",
    onEnd: () => {
      // Serializa a ordem pelo id do item
      const order = [...sortableEl.children].map((li) => li.id).join(",");
      localStorage.setItem(localStorageKey, order);
    },
  });

  // Restaura ordem salva no localStorage
  const savedOrder = localStorage.getItem(localStorageKey);
  if (savedOrder) {
    const idsOrder = savedOrder.split(",");
    const items = Array.from(sortableEl.children);
    // Reordena os elementos no DOM
    idsOrder.reverse().forEach((id) => {
      const el = items.find((item) => item.id === id);
      if (el) sortableEl.prepend(el);
    });
  }
} else {
  console.warn(
    "Biblioteca SortableJS não encontrada. Instale e importe antes deste script."
  );
}

// --- Disable text selection no container sortable ---
document.getElementById("sortable").style.userSelect = "none";

// --- Renameable inline editing ---

document.querySelectorAll(".renameable").forEach((div) => {
  let originalValue = "";

  div.addEventListener("dblclick", () => {
    originalValue = div.textContent.trim();
    div.textContent = "";

    const input = document.createElement("input");
    input.type = "text";
    input.value = originalValue;
    input.maxLength = 40;
    div.appendChild(input);
    input.focus();

    input.addEventListener("change", () => {
      div.textContent = input.value || originalValue;
    });

    input.addEventListener("blur", () => {
      div.textContent = input.value || originalValue;
    });

    // Opcional: permitir salvar ao pressionar Enter
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        input.blur();
      }
    });
  });
});

////////////////////


////////////////////




//////////////////////////////////////

function jumpNextSlot(memory_slot, name, info, logo, alt_waiting_time) {
  const name_loaded = $(name + ":text").val();
  const info_loaded = $(info + ":text").val();
  const logo_loaded = $(logo).attr("src");

  let find_next = false;
  let first_stored_slot = null;
  let next_slot_num = null;
  let to_load = null;

  // Itera pelos slots para encontrar:
  // 1. O primeiro slot armazenado
  // 2. O slot atual carregado
  // 3. O próximo slot armazenado para carregar
  $("ul" + memory_slot + " li").each(function () {
    const $this = $(this);
    const slot_number = Number($this.children(".slot-number").text());

    const name_value = $this.children(".stored-name").text();
    const info_value = $this.children(".stored-info").text();
    const logo_value = $this.children(".stored-logo").text();

    const name_id = $this.children(".stored-name").attr("id");
    const info_id = $this.children(".stored-info").attr("id");
    const logo_id = $this.children(".stored-logo").attr("id");

    const emptySlot =
      $("#" + name_id).is(":empty") &&
      $("#" + info_id).is(":empty") &&
      $("#" + logo_id).is(":empty");

    const loadedSlot =
      name_loaded === name_value &&
      info_loaded === info_value &&
      (logo_loaded === logo_value || $(logo).hasClass(logo_value));

    if (first_stored_slot === null && !emptySlot) {
      first_stored_slot = slot_number;
    }

    if (loadedSlot) {
      find_next = true;
      next_slot_num = slot_number + 1;
    }

    if (find_next) {
      // Se achou o slot seguinte e ele não está vazio, marca para carregar
      if (slot_number === next_slot_num && !emptySlot) {
        to_load = slot_number;
        find_next = false; // Para não alterar to_load novamente
      }
      // Se passou do limite (ex: > 10) ou slot vazio, volta pro primeiro armazenado
      if (next_slot_num > 10 || emptySlot) {
        to_load = first_stored_slot;
        find_next = false;
      }
    }
  });

  // Carrega o slot selecionado, se existir
  if (to_load !== null) {
    const $slot = $("ul" + memory_slot + " li:nth-child(" + to_load + ")");
    const slot_id = $slot.attr("id");

    const name_to_load = $slot.children(".stored-name").text();
    const info_to_load = $slot.children(".stored-info").text();
    const logo_to_load = $slot.children(".stored-logo").text();

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
  }
}

//////////////////////////////////////

function loadSlot(
  name,
  info,
  logo,
  name_to_load,
  info_to_load,
  logo_to_load,
  alt_waiting_time,
  from_hotkey = true
) {
  setTimeout(() => {
    const default_logo_selector = logo.replace("-preview", "-default");
    const default_logo_value = $(default_logo_selector).attr("src");

    $(name + ":text").val(name_to_load);
    $(info + ":text").val(info_to_load);

    if (logo_to_load === "default") {
      logo_to_load = default_logo_value;
    }
    $(logo).attr("src", logo_to_load);

    refreshData();
  }, alt_waiting_time * 1000);

  // Auto trigger switch logic
  const auto_trigger_id = name
    .replace("#", "")
    .replace("-name", "-autotrigger");
  const alt_switch_num = name.replace("#alt-", "").replace("-name", "");

  if (
    from_hotkey &&
    document.getElementById(auto_trigger_id)?.checked &&
    !$("#lower-thirds-switch" + alt_switch_num).is(":checked")
  ) {
    $("#lower-thirds-switch" + alt_switch_num)
      .prop("checked", true)
      .change();
  }
}

function clearAltInputs(altNum) {
  $(`#alt-${altNum}-name:text`).val("").change();
  $(`#alt-${altNum}-info:text`).val("").change();

  const defaultLogoSrc = $(`#alt-${altNum}-logo-default`).attr("src");
  $(`#alt-${altNum}-logo-preview`).attr("src", defaultLogoSrc).change();
}

// Bind dos 4 botões
[1, 2, 3, 4].forEach((num) => {
  $(`#alt-${num}-clean-inputs`).click(() => clearAltInputs(num));
});

$("#toggle-preview").click(() => {
  const toggleBtn = document.getElementById("toggle-preview");
  const preview = document.getElementById("alt-preview");
  const panel = document.getElementById("alt-panel");

  toggleBtn.classList.toggle("active");
  preview.classList.toggle("active");

  panel.style.marginBottom =
    panel.style.marginBottom === "0px" ? "220px" : "0px";
});

///////////////////////////////////////

//////////////////////////////////////
