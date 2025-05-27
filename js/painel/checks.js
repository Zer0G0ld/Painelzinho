function checkSwitches() {
  const masterSwitch = document.getElementById("lower-thirds-masterswitch");
  const masterActive = masterSwitch.checked;
  const mainContent = document.getElementById("alt-main-config-content");

  mainContent.classList.toggle("active", masterActive);

  // Função para ativar/desativar conteúdo com classes 'active'/'inactive'
  function setContentState(contentEl, isActive) {
    if (isActive) {
      contentEl.classList.add("active");
      contentEl.classList.remove("inactive");
    } else {
      contentEl.classList.add("inactive");
      contentEl.classList.remove("active");
    }
  }

  // Função para resetar classes (remover todas)
  function resetContentState(contentEl) {
    contentEl.className = "";
  }

  function handleSwitch(num) {
    const switchEl = document.getElementById(`lower-thirds-switch${num}`);
    const contentEl = document.getElementById(`alt-${num}-config-content`);

    // Pega valores globais de forma segura
    const activeTime = Number(window[`alt_${num}_active_time_monitor`] ?? -1);
    const inactiveTime = Number(window[`alt_${num}_inactive_time_monitor`] ?? -1);
    const name = window[`alt_${num}_name`] || "";
    const info = window[`alt_${num}_info`] || "";
    const autoload = Boolean(window[`alt_${num}_autoload`]);
    const waitingTime = window[`alt_${num}_waiting_time`] || 0;
    const turnOff = Boolean(window[`alt_${num}_turnoff`]);
    const jumpNextFlagKey = `alt_${num}_jumpnext`;

    const jumpNextFlag = Boolean(window[jumpNextFlagKey]);

    if (masterActive) {
      if (switchEl.checked) {
        if (activeTime >= 0 && inactiveTime === 0 && name && info) {
          setContentState(contentEl, true);
          window[jumpNextFlagKey] = true;
        } else {
          setContentState(contentEl, false);

          if (autoload && jumpNextFlag) {
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
        resetContentState(contentEl);

        if (turnOff && autoload && jumpNextFlag) {
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
      // master OFF
      if (switchEl.checked) {
        setContentState(contentEl, false);
      } else {
        resetContentState(contentEl);
      }
    }
  }

  for (let i = 1; i <= 4; i++) {
    handleSwitch(i);
  }
}
