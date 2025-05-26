// utils.js
export function getIndexFromId(id) {
  // Extrai o índice do ID, ex: 'lower-third-1' => 0
  const match = id.match(/\d+/);
  if (!match) return -1;
  return parseInt(match[0], 10) - 1;
}

export function updateAlignment(element, currentAlign, previousAlign, isHidden) {
  if (currentAlign !== previousAlign) {
    if (isHidden) element.classList.add("hide-anim");
    ["left", "center", "right"].forEach((alignment) => {
      element.classList.replace(alignment, currentAlign);
    });
  }
}

export function updateStyle(element, currentStyle, previousStyle, isHidden) {
  if (currentStyle !== previousStyle) {
    if (isHidden) element.classList.add("hide-anim");
    ["style-1", "style-2", "style-3"].forEach((styleClass) => {
      element.classList.replace(styleClass, `style-${currentStyle}`);
    });
  }
}
