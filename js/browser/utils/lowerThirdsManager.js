// lowerThirdsManager.js
import { getIndexFromId, updateAlignment, updateStyle } from './utils.js';
import { startActiveCount, startInactiveCount, stopTimeCount } from './timers.js';
import { animationIn, animationOut } from './animationHandlers.js';

export function processLowerThirds(lowerThirds, mode) {
  if (mode === "preview") {
    lowerThirds.forEach((lt, i) => {
      window[lt.activeTimeVar] = Infinity;
      lowerThirds[i].switchVal = lt.preview;
    });
  }

  lowerThirds.forEach((lt, index) => {
    const el = document.getElementById(`lower-third-${lt.id}`);
    if (!el) return;

    const shouldHide =
      lt.switchVal === "false" || lt.name.length === 0 || lt.info.length === 0;

    if (shouldHide) {
      if (lt.canIn) {
        lowerThirds[index].canIn = false;
      }
      stopTimeCount(`lower-third-${lt.id}`);
      animationOut(`lower-third-${lt.id}`);
    } else {
      if (!lt.canIn) {
        lowerThirds[index].canIn = true;
        el.classList.remove("hide-anim");
        startActiveCount(`lower-third-${lt.id}`);
        animationIn(`lower-third-${lt.id}`);
      }
    }

    updateAlignment(el, lt.align, lt.oldAlign, lt.switchVal === "false");
    lowerThirds[index].oldAlign = lt.align;

    updateStyle(el, lt.style, lt.oldStyle, lt.switchVal === "false");
    lowerThirds[index].oldStyle = lt.style;
  });
}
