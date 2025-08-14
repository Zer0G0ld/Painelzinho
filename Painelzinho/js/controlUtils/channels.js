// channels.js
const broadcastChannels = {
  send: new BroadcastChannel("obs-painelzinho-channel"),
  receive: new BroadcastChannel("obs-painelzinho-channel2"),
  fonts: new BroadcastChannel("obs-painelzinho-fonts"),
};

// Inicializa listener para receber dados do browser-source.js
function initChannelListeners(refreshData, checkSwitches, function_send_font) {
  broadcastChannels.receive.onmessage = function(ev) {
    const received_data = ev.data;

    if (received_data.resend) {
      refreshData();
      function_send_font();
      return;
    }

    for (let i = 1; i <= 4; i++) {
      window[`alt_${i}_active_time_monitor`] = received_data[`activeTime${i}_to_send`];
      window[`alt_${i}_inactive_time_monitor`] = received_data[`inactiveTime${i}_to_send`];

      document.getElementById(`alt-${i}-active-time-monitor`).innerHTML =
        window[`alt_${i}_active_time_monitor`];
      document.getElementById(`alt-${i}-inactive-time-monitor`).innerHTML =
        window[`alt_${i}_inactive_time_monitor`];

      if (received_data[`alt_${i}_turnoff`] && $(`#painelzinhos-switch${i}`).is(":checked")) {
        $(`#painelzinhos-switch${i}`).prop("checked", false).change();
      }
    }

    checkSwitches();
  };
}


export { broadcastChannels, initChannelListeners };