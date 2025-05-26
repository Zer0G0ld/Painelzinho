function checkSwitches() {
  const masterSwitch = document.getElementById("lower-thirds-masterswitch");
  const masterActive = masterSwitch.checked;
  const mainContent = document.getElementById("alt-main-config-content");

  // Atualiza classe do conteúdo principal
  mainContent.classList.toggle("active", masterActive);

  // Função auxiliar para lidar com cada switch
  function handleSwitch(num) {
    const switchEl = document.getElementById(`lower-thirds-switch${num}`);
    const contentEl = document.getElementById(`alt-${num}-config-content`);

    // Variáveis dinâmicas que você deve garantir que existem no escopo
    const activeTime = window[`alt_${num}_active_time_monitor`];
    const inactiveTime = window[`alt_${num}_inactive_time_monitor`];
    const name = window[`alt_${num}_name`];
    const info = window[`alt_${num}_info`];
    const autoload = window[`alt_${num}_autoload`];
    const jumpNextFlagKey = `alt_${num}_jumpnext`;
    const waitingTime = window[`alt_${num}_waiting_time`];
    const turnOff = window[`alt_${num}_turnoff`];

    // A flag de controle que você deve garantir existir (boolean) no escopo global
    if (masterActive) {
      if (switchEl.checked) {
        if (activeTime >= 0 && inactiveTime === 0 && name && info) {
          contentEl.classList.add("active");
          contentEl.classList.remove("inactive");
          window[jumpNextFlagKey] = true;
        } else {
          contentEl.classList.remove("active");
          contentEl.classList.add("inactive");

          if (autoload && window[jumpNextFlagKey]) {
            window[jumpNextFlagKey] = false;
            jumpNextSlot(
              `#alt-${num}-memory-slots`,
              `#alt-${num}-name`,
              `#alt-${num}-info`,
              `#alt-${num}-logo-preview`,
              waitingTime
            );
          }
        }
      } else {
        contentEl.className = "";
        if (turnOff && autoload && window[jumpNextFlagKey]) {
          window[jumpNextFlagKey] = false;
          jumpNextSlot(
            `#alt-${num}-memory-slots`,
            `#alt-${num}-name`,
            `#alt-${num}-info`,
            `#alt-${num}-logo-preview`,
            waitingTime
          );
        }
      }
    } else {
      // Quando o master está OFF
      if (switchEl.checked) {
        contentEl.classList.add("inactive");
        contentEl.classList.remove("active");
      } else {
        contentEl.className = "";
      }
    }
  }

  // Aplica para os 4 switches
  for (let i = 1; i <= 4; i++) {
    handleSwitch(i);
  }
}
