// hotkeys-ui.js
import { hotkeySwitches, checkMemorySlots } from './hotkeys-core.js';

// Alterna checkbox e dispara .change()
function toggleCheckbox(id) {
  const $chk = $(`#${id}`);
  $chk.prop('checked', !$chk.prop('checked')).change();
}

// Checagem principal dos hotkeys
function checkHotkeys() {
  // Checa switches de painel
  hotkeySwitches.forEach(({ hotkey, oldHotkey, id }) => {
    if (window[hotkey] !== window[oldHotkey]) {
      toggleCheckbox(id);
      window[oldHotkey] = window[hotkey];
    }
  });

  // Checa memory slots
  checkMemorySlots();
}

export { checkHotkeys, toggleCheckbox };