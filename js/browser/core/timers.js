// timers.js
export const alt_active_time = [10, 12, 8, 15];
export const alt_inactive_time = [5, 5, 5, 5];
export const alt_oneshot = [false, true, false, false];
export const alt_turnoff = [false, false, false, false];

const c = [0, 0, 0, 0];
const d = [0, 0, 0, 0];
const t = [null, null, null, null];
const s = [null, null, null, null];
const activeIsOn = [false, false, false, false];
const inactiveIsOn = [false, false, false, false];

// Resetar estado do slot
export function resetSlot(i) {
  if (i < 0 || i > 3) return;
  c[i] = d[i] = 0;
  t[i] = s[i] = null;
  activeIsOn[i] = inactiveIsOn[i] = alt_turnoff[i] = false;
}

// Timer genérico
function startTimer(i, counter, timeoutRef, limit, onComplete) {
  if (i === -1) return;
  if (counter[i] <= limit[i]) {
    counter[i]++;
    timeoutRef[i] = setTimeout(
      () => startTimer(i, counter, timeoutRef, limit, onComplete),
      1000
    );
  } else if (onComplete) {
    onComplete(i);
  }
}

export function activeCount(i, stopTimeCount, startInactiveCount, animationIn) {
  startTimer(i, c, t, alt_active_time, () => {
    stopTimeCount(i);
    startInactiveCount(i);
  });
}

export function inactiveCount(i, startActiveCount) {
  startTimer(i, d, s, alt_inactive_time, () => {
    d[i] = 0;
    clearTimeout(s[i]);
    inactiveIsOn[i] = false;
    startActiveCount(i);
  });
}

export function startActiveCount(i, activeIsOn, activeCount, animationIn) {
  if (i === -1 || activeIsOn[i]) return;
  activeIsOn[i] = true;
  activeCount(i);
  animationIn(i);
}

export function startInactiveCount(i, inactiveIsOn, alt_oneshot, alt_turnoff, inactiveCount, animationOut) {
  if (i === -1 || inactiveIsOn[i]) return;
  inactiveIsOn[i] = true;
  if (alt_oneshot[i]) {
    alt_turnoff[i] = true;
  } else {
    inactiveCount(i);
  }
  animationOut(i);
}
