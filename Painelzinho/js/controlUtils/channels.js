// channels.js
const broadcastChannels = {
  send: new BroadcastChannel("obs-painelzinho-channel"),
  receive: new BroadcastChannel("obs-painelzinho-channel2"),
  fonts: new BroadcastChannel("obs-painelzinho-fonts"),
};

/**
 * Inicializa listeners para receber dados do browser-source.js
 * @param {Function} refreshData - função para atualizar o painel
 * @param {Function} checkSwitches - função para atualizar switches
 * @param {Function} function_send_font - função para enviar fontes
 * @param {Number} totalSlots - quantidade de slots (default: 4)
 */
function initChannelListeners(refreshData, checkSwitches, function_send_font, totalSlots = 4) {
  broadcastChannels.receive.onmessage = (ev) => {
    const data = ev.data;

    if (data.resend) {
      refreshData();
      function_send_font();
      return;
    }

    for (let i = 1; i <= totalSlots; i++) {
      const activeTime = data[`activeTime${i}_to_send`] ?? 0;
      const inactiveTime = data[`inactiveTime${i}_to_send`] ?? 0;

      // Atualiza elementos do DOM
      const activeEl = document.getElementById(`alt-${i}-active-time-monitor`);
      const inactiveEl = document.getElementById(`alt-${i}-inactive-time-monitor`);

      if (activeEl) activeEl.textContent = activeTime;
      if (inactiveEl) inactiveEl.textContent = inactiveTime;

      // Atualiza switches conforme a informação recebida
      const turnOff = data[`alt_${i}_turnoff`];
      const switchEl = $(`#painelzinhos-switch${i}`);
      if (turnOff && switchEl.is(":checked")) {
        switchEl.prop("checked", false).change();
      }
    }

    checkSwitches();
  };
}

export { broadcastChannels, initChannelListeners };
