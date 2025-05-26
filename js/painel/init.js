/**
 * Função para adicionar comportamento accordion e more
 */
function setupToggleClass(triggerClass, activeClass = "active") {
  const elements = document.getElementsByClassName(triggerClass);
  Array.from(elements).forEach((el) => {
    el.onclick = function () {
      this.classList.toggle(activeClass);
      const nextEl = this.nextElementSibling;
      if (!nextEl) return;
      if (nextEl.style.maxHeight) {
        nextEl.style.maxHeight = null;
      } else {
        nextEl.style.maxHeight = nextEl.scrollHeight + "px";

        if (triggerClass === "more") {
          // Ajusta a altura do painel principal para comportar o conteúdo expandido
          const panel = document.getElementById("global-configuration");
          if (panel) {
            const currentHeight =
              parseInt(panel.style.maxHeight) || panel.scrollHeight;
            panel.style.maxHeight = currentHeight + nextEl.scrollHeight + "px";
          }
        }
      }
    };
  });
}

// Inicializa accordions e more
setupToggleClass("accordion");
setupToggleClass("more");

function updateMoreMaxHeight() {
  const moreElement = document.getElementsByClassName("more")[0];
  const globalConfig = document.getElementById("global-configuration");

  // Se não encontrou o elemento, sai da função
  if (!moreElement || !globalConfig) return;

  const moreSettings = document.getElementById("more-settings");
  if (!moreSettings) return;

  const maxHeight = window.getComputedStyle(moreSettings).maxHeight;

  if (maxHeight !== "0px") {
    const hideMore = moreElement.nextElementSibling;
    if (!hideMore) return;

    const scrollHeight = hideMore.scrollHeight;
    hideMore.style.maxHeight = scrollHeight + "px";

    // Pega o maxHeight atual do painel global e converte para número (0 se inválido)
    const currentMaxHeight =
      parseFloat(window.getComputedStyle(globalConfig).maxHeight) || 0;

    // Atualiza maxHeight somando o scrollHeight do hideMore
    globalConfig.style.maxHeight = currentMaxHeight + scrollHeight + "px";
  }
}

