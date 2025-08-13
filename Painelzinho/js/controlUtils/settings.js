// settings.js
import { broadcastChannels } from './channels.js';

export function function_send() {
  const global_lock_active = !!document.getElementById("global-lock-active").checked;

  for (let i = 1; i <= 4; i++) {
    window[`alt_${i}_lock_active`] = !!document.getElementById(`alt-${i}-lock-active`).checked;
  }

  const data = {
    global_animation_time: $("#global-animation-time").val(),
    global_active_time: global_lock_active ? Infinity : $("#global-active-time").val(),
    global_inactive_time: $("#global-inactive-time").val(),
  };

  const slotKeys = ["switch","style","name","info","logo_image","animation_time"];
  for (let i = 1; i <= 4; i++) {
    slotKeys.forEach(key => {
      data[`alt_${i}_${key}`] = window[`alt_${i}_${key}`];
    });
  }

  broadcastChannels.send.postMessage(data);
}
