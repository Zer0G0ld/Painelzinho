import { checkMemorySlots } from './hotkeys-core.js';
import { hotkeys } from './hotkeys.js';

// Alterna valor de uma hotkey no objeto hotkeys e atualiza UI
function toggleCheckbox(key) {
  if (hotkeys.switches[key] !== undefined) {
    hotkeys.switches[key] = hotkeys.switches[key] ? 0 : 1;
  } else if (hotkeys.slots[key] !== undefined) {
    hotkeys.slots[key] = hotkeys.slots[key] ? 0 : 1;
  }
  checkHotkeys(); // atualiza a UI
}

// Checagem principal dos hotkeys
function checkHotkeys() {
  // Atualiza switches
  Object.entries(hotkeys.switches).forEach(([key, value]) => {
    const id = `painelzinhos-${key.toLowerCase()}`;
    const $chk = $(`#${id}`);
    const checked = value === 1;
    if ($chk.prop('checked') !== checked) {
      $chk.prop('checked', checked).change();
    }
  });

  // Atualiza memory slots
  checkMemorySlots(); // agora pega direto do hotkeys.slots internamente
}

export { checkHotkeys, toggleCheckbox };
