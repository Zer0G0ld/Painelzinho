// Painelzinho/js/control-panel.js
import * as controlUtils from './controlUtils.bundle.js';

$(function () {
  console.log("Painel carregado com jQuery!");

  // calcula próximo índice do painel
  const nextIndex = document.querySelectorAll('#sortable .sortees').length + 1;
  //const controlUtils = window.controlUtils;

  // ------------------------
  // Funções internas
  // ------------------------
  function checkAltSwitch(i, masterSwitch) {
    const switchEl = document.getElementById(`painelzinhos-switch${i}`);
    const configEl = document.getElementById(`alt-${i}-config-content`);

    const activeMonitor = window[`alt_${i}_active_time_monitor`];
    const inactiveMonitor = window[`alt_${i}_inactive_time_monitor`];
    const name = window[`alt_${i}_name`];
    const info = window[`alt_${i}_info`];
    let jumpnext = window[`alt_${i}_jumpnext`];
    const autoload = window[`alt_${i}_autoload`];
    const turnoff = window[`alt_${i}_turnoff`];
    const waitingTime = window[`alt_${i}_waiting_time`];

    if (!masterSwitch) {
      configEl.className = switchEl.checked ? "inactive" : "";
      configEl.classList.remove("active");
      return;
    }

    if (switchEl.checked) {
      if (activeMonitor >= 0 && inactiveMonitor === 0 && name && info) {
        configEl.classList.add("active");
        configEl.classList.remove("inactive");
        window[`alt_${i}_jumpnext`] = true;
      } else {
        configEl.classList.add("inactive");
        configEl.classList.remove("active");
        if (autoload && jumpnext) {
          window[`alt_${i}_jumpnext`] = false;
          jumpNextSlot(`#alt-${i}-memory-slots`, `#alt-${i}-name`, `#alt-${i}-info`, `#alt-${i}-logo-preview`, waitingTime);
        }
      }
    } else {
      configEl.className = "";
      if (turnoff && autoload && jumpnext) {
        window[`alt_${i}_jumpnext`] = false;
        jumpNextSlot(`#alt-${i}-memory-slots`, `#alt-${i}-name`, `#alt-${i}-info`, `#alt-${i}-logo-preview`, waitingTime);
      }
    }
  }

  function checkSwitches() {
    const masterSwitch = document.getElementById("painelzinhos-masterswitch").checked;
    window.masterSwitchIsOn = masterSwitch;

    document.getElementById("alt-main-config-content").classList.toggle("active", masterSwitch);

    for (let i = 1; i <= 4; i++) checkAltSwitch(i, masterSwitch);
  }

  function refreshData() {
    console.log("refreshData");

    checkLogos();
    Array.from({ length: 4 }, (_, i) => i + 1).forEach(i =>
      checkSlots(`#alt-${i}-memory-slots`, `#alt-${i}-name`, `#alt-${i}-info`, `#alt-${i}-logo-preview`)
    );

    getAppearance();
    checkSwitches();
    function_send();
  }

  function checkUpdates() {
    [checkHotkeys, updateHotkeys].forEach(task => task());
  }

  // Contador global de painéis (inicia com os já existentes)
  let painelCounter = document.querySelectorAll('#alt-panel .sortees').length || 1;

  // Função para criar um novo painel
  function criarNovoPainel() {
    const template = document.getElementById('painel-template');
    const clone = template.content.cloneNode(true);

    // Incrementa contador
    painelCounter++;

    // Ajusta atributos clonados
    const sorte = clone.querySelector('.sortees');
    sorte.dataset.altIndex = painelCounter;

    const numberIcon = clone.querySelector('.alt-number-icon');
    numberIcon.textContent = painelCounter;

    const title = clone.querySelector('.renameable');
    title.textContent = `Painelzinho ${painelCounter}`;

    // Atualiza name dos radios para não conflitar
    const radios = clone.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      const baseName = radio.name;
      radio.name = `${baseName}-${painelCounter}`;
    });

    // Adiciona clone ao container
    const container = document.getElementById('alt-panel');
    container.appendChild(clone);

    // Inicializa os utilitários do painel recém-criado
    controlUtils.loadData();
    controlUtils.updateCustomFontList();
    controlUtils.checkSwitches();
  }

  // Cria botão para adicionar painel
  const btnAddPainel = document.createElement('button');
  btnAddPainel.textContent = "Adicionar Painel";
  btnAddPainel.style.margin = "10px";
  btnAddPainel.onclick = criarNovoPainel;

  // Adiciona botão no topo após o DOM estar pronto
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('alt-panel');
    container.prepend(btnAddPainel);
  });

  // inicializações de utilitários
  [
    controlUtils.settingsTooltips,
    controlUtils.loadDefaultValues,
    controlUtils.loadData,
    controlUtils.updateCustomFontList,
    controlUtils.checkSwitches,
    controlUtils.saveData,
  ].forEach(fn => fn());
  refreshData();
  checkUpdates();

  // ------------------------
  // Delegação para botões step up/down
  // ------------------------
  document.getElementById('sortable').addEventListener('click', e => {
    const stepBtn = e.target.closest('button');
    if (!stepBtn) return;
    const numberInput = stepBtn.parentNode.querySelector('input[type=number]');
    if (!numberInput) return;
    if (stepBtn.classList.contains('up')) numberInput.stepUp();
    if (stepBtn.classList.contains('down')) numberInput.stepDown();
  });

  // atualizações periódicas
  setInterval(() => {
    controlUtils.checkHotkeys();
    controlUtils.updateHotkeys();
  }, 200);

  // ready
  $(document).ready(() => $("#defaultTab").click());
  // Sistema de Tabs
  document.querySelectorAll(".tablinks").forEach(btn => {
    btn.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");

      // Esconde todos os conteúdos
      document.querySelectorAll(".tabcontent").forEach(tc => tc.style.display = "none");

      // Remove classe ativa dos botões
      document.querySelectorAll(".tablinks").forEach(tl => tl.classList.remove("active"));

      // Mostra a aba clicada
      document.getElementById(`tab-${tabName}`).style.display = "block";

      // Marca o botão como ativo
      this.classList.add("active");
    });
  });

  // Ativa a primeira aba por padrão
  const firstTab = document.querySelector(".tablinks");
  if (firstTab) firstTab.click();

});