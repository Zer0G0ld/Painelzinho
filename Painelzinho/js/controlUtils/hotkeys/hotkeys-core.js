// hotkeys-core.js

// Reload do hotkeys.js atualizado pelo Lua
function updateHotkeys() {
  const src = "../common/js/hotkeys.js";
  $('script[src="' + src + '"]').remove();
  const head = document.getElementsByTagName("head")[0];
  const script = document.createElement("script");
  script.src = src;
  head.appendChild(script);
}

// Dados de switches e memory slots
const hotkeySwitches = [
  { hotkey: "hotkeyMasterSwitch", oldHotkey: "hotkeyMasterSwitchOld", id: "painelzinhos-masterswitch" },
  { hotkey: "hotkeySwitch1", oldHotkey: "hotkeySwitch1Old", id: "painelzinhos-switch1" },
  { hotkey: "hotkeySwitch2", oldHotkey: "hotkeySwitch2Old", id: "painelzinhos-switch2" },
  { hotkey: "hotkeySwitch3", oldHotkey: "hotkeySwitch3Old", id: "painelzinhos-switch3" },
  { hotkey: "hotkeySwitch4", oldHotkey: "hotkeySwitch4Old", id: "painelzinhos-switch4" },
];

const memorySlots = [
  {
    prefix: "#alt-1",
    hotkeys: Array.from({length:10}, (_,i) => ({
      hotkey: `hotkeyAlt1Slot${i+1}`,
      oldHotkey: `hotkeyAlt1Slot${i+1}Old`,
      index: i + 1
    }))
  },
  {
    prefix: "#alt-2",
    hotkeys: Array.from({length:10}, (_,i) => ({
      hotkey: `hotkeyAlt2Slot${i+1}`,
      oldHotkey: `hotkeyAlt2Slot${i+1}Old`,
      index: i + 1
    }))
  },
  {
    prefix: "#alt-3",
    hotkeys: Array.from({length:10}, (_,i) => ({
      hotkey: `hotkeyAlt3Slot${i+1}`,
      oldHotkey: `hotkeyAlt3Slot${i+1}Old`,
      index: i + 1
    }))
  },
  {
    prefix: "#alt-4",
    hotkeys: Array.from({length:10}, (_,i) => ({
      hotkey: `hotkeyAlt4Slot${i+1}`,
      oldHotkey: `hotkeyAlt4Slot${i+1}Old`,
      index: i + 1
    }))
  }
];

// Função genérica para processar memory slots
function checkMemorySlots() {
  memorySlots.forEach(slotGroup => {
    slotGroup.hotkeys.forEach(({ hotkey, oldHotkey, index }) => {
      if (window[hotkey] !== window[oldHotkey]) {
        loadSlot(
          `${slotGroup.prefix}-name`,
          `${slotGroup.prefix}-info`,
          `${slotGroup.prefix}-logo-preview`,
          $(`${slotGroup.prefix}-name-${index}`).text(),
          $(`${slotGroup.prefix}-info-${index}`).text(),
          $(`${slotGroup.prefix}-logo-${index}`).text(),
          0
        );
        window[oldHotkey] = window[hotkey];
      }
    });
  });
}
export { updateHotkeys, checkMemorySlots, hotkeySwitches, memorySlots };