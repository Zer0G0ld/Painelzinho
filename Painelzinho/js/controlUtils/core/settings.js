// settings.js
import { broadcastChannels } from "../channels.js";
import { slotAppearance } from "./appearance.js"; // usa o objeto centralizado

function function_send(totalSlots = 4) {
  const globalLockActive = !!document.getElementById("global-lock-active").checked;

  // Monta dados globais
  const data = {
    global_animation_time: $("#global-animation-time").val(),
    global_active_time: globalLockActive ? Infinity : $("#global-active-time").val(),
    global_inactive_time: $("#global-inactive-time").val(),
    slots: {}
  };

  // Monta dados por slot
  for (let i = 1; i <= totalSlots; i++) {
    const slotData = {
      lock_active: !!document.getElementById(`alt-${i}-lock-active`)?.checked,
      switch: !!document.getElementById(`painelzinhos-switch${i}`)?.checked,
      style: slotAppearance[i]?.style || "1",
      name: $(`#alt-${i}-name`).val() || "",
      info: $(`#alt-${i}-info`).val() || "",
      logo_image: $(`#alt-${i}-logo-preview`).attr("src") || "",
      animation_time: $(`#alt-${i}-animation-time`).val() || 0
    };
    data.slots[i] = slotData;
  }

  // Envia via broadcast
  broadcastChannels.send.postMessage(data);
}

export { function_send };
