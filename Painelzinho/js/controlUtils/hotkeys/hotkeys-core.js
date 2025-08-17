// hotkeys-core.js
import { hotkeys } from "./hotkeys";
import { checkSlots } from "../memory/memory-slots.js";

// Atualiza o script de hotkeys (carregado pelo Lua)
function updateHotkeys() {
  const src = "../common/js/hotkeys.js";
  $('script[src="' + src + '"]').remove();
  const script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}

// Estrutura de switches
const hotkeySwitches = [
  { id: "painelzinhos-masterswitch", key: "MASTER" },
  { id: "painelzinhos-switch1", key: "SWITCH1" },
  { id: "painelzinhos-switch2", key: "SWITCH2" },
  { id: "painelzinhos-switch3", key: "SWITCH3" },
  { id: "painelzinhos-switch4", key: "SWITCH4" },
];

// Estrutura de memory slots
const memorySlotsGroups = Array.from({ length: 4 }, (_, g) => ({
  prefix: `#alt-${g + 1}`,
  slots: Array.from({ length: 10 }, (_, i) => ({
    key: `ALT${g + 1}SLOT${i + 1}`,
    index: i + 1
  }))
}));

// Função para processar memory slots automaticamente
function checkMemorySlots() {
  memorySlotsGroups.forEach(group => {
    group.slots.forEach(({ key, index }) => {
      const slotValue = hotkeys.slots[key] || 0;
      const $slotName = $(`${group.prefix}-name-${index}`);
      const $slotInfo = $(`${group.prefix}-info-${index}`);
      const $slotLogo = $(`${group.prefix}-logo-${index}`);

      // Atualiza a UI do slot
      checkSlots(group.prefix + "-memory-slots", group.prefix + "-name", group.prefix + "-info", group.prefix + "-logo-preview");

      // Marca slot ativo ou não
      if (slotValue) $(`#${key.toLowerCase()}`).addClass("active-slot");
      else $(`#${key.toLowerCase()}`).removeClass("active-slot");
    });
  });
}

export { updateHotkeys, checkMemorySlots, hotkeySwitches, memorySlotsGroups };
