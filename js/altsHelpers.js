// Inicia a contagem do tempo ativo para um ALT
export function startActiveCount(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.classList.add("active");
  el.classList.remove("hidden");

  // Aqui você pode iniciar contadores, timers ou outras animações se quiser.
}

// Para a contagem de tempo ativo para um ALT
export function stopTimeCount(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.classList.remove("active");
  el.classList.add("hidden");

  // Pode também limpar timers aqui, se estiverem sendo usados.
}

// Atualiza a classe de alinhamento (left, center, right)
export function updateAlignment(el, currentAlign, previousAlign, isHidden) {
  if (currentAlign !== previousAlign) {
    if (isHidden) el.classList.add("hide-anim");

    ["left", "center", "right"].forEach((alignment) => {
      el.classList.remove(alignment);
    });

    el.classList.add(currentAlign);
  }
}

// Atualiza o estilo (ex: style-1, style-2, style-3)
export function updateStyle(el, currentStyle, previousStyle, isHidden) {
  if (currentStyle !== previousStyle) {
    if (isHidden) el.classList.add("hide-anim");

    ["style-1", "style-2", "style-3"].forEach((styleClass) => {
      el.classList.remove(styleClass);
    });

    el.classList.add(`style-${currentStyle}`);
  }
}
