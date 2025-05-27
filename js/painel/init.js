// init.js

/**
 * Função para adicionar comportamento accordion ou more (toggle de classe e maxHeight)
 * @param {string} triggerClass - Classe dos elementos que acionam o toggle
 * @param {Object} options - Opções adicionais
 * @param {string} [options.activeClass="active"] - Classe que será adicionada/removida no toggle
 * @param {Function} [options.onExpand] - Callback executado ao expandir um item
 */
function setupToggleClass(triggerClass, options = {}) {
  const { activeClass = "active", onExpand } = options;
  const elements = document.getElementsByClassName(triggerClass);

  Array.from(elements).forEach((el) => {
    el.onclick = function () {
      this.classList.toggle(activeClass);
      const nextEl = this.nextElementSibling;
      if (!nextEl) return;

      if (nextEl.style.maxHeight) {
        // Colapsa
        nextEl.style.maxHeight = null;
      } else {
        // Expande
        nextEl.style.maxHeight = nextEl.scrollHeight + "px";

        if (typeof onExpand === "function") {
          onExpand(this, nextEl);
        }
      }
    };
  });
}

/**
 * Ajusta a altura do painel principal para comportar o conteúdo expandido do "more"
 * @param {HTMLElement} triggerElement - Elemento que disparou o evento
 * @param {HTMLElement} contentElement - Elemento que está sendo expandido
 */
function adjustGlobalConfigHeight(triggerElement, contentElement) {
  const panel = document.getElementById("global-configuration");
  if (!panel) return;

  // Pega a altura atual computada do painel global
  const computedStyle = window.getComputedStyle(panel);
  const currentMaxHeight = parseFloat(computedStyle.maxHeight) || panel.scrollHeight;

  // Ajusta somando o conteúdo recém expandido
  panel.style.maxHeight = currentMaxHeight + contentElement.scrollHeight + "px";
}

/**
 * Atualiza a altura do "more-settings" e ajusta o painel global de configurações
 */
function updateMoreMaxHeight() {
  const moreElement = document.getElementsByClassName("more")[0];
  const globalConfig = document.getElementById("global-configuration");
  if (!moreElement || !globalConfig) return;

  const moreSettings = document.getElementById("more-settings");
  if (!moreSettings) return;

  const maxHeight = window.getComputedStyle(moreSettings).maxHeight;
  if (maxHeight === "0px") return;

  const hideMore = moreElement.nextElementSibling;
  if (!hideMore) return;

  hideMore.style.maxHeight = hideMore.scrollHeight + "px";

  const currentMaxHeight = parseFloat(window.getComputedStyle(globalConfig).maxHeight) || 0;
  globalConfig.style.maxHeight = currentMaxHeight + hideMore.scrollHeight + "px";
}

/**
 * Função principal de inicialização do painel
 */
export function initPanel() {
  // Accordion padrão
  setupToggleClass("accordion");

  // Toggle "more" com ajuste extra de altura do painel
  setupToggleClass("more", {
    onExpand: adjustGlobalConfigHeight,
  });

  // Atualiza maxHeight inicial caso o "more-settings" já esteja aberto no carregamento
  updateMoreMaxHeight();
}

// Opcional: roda initPanel ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
  initPanel();
});
