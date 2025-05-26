import {
  alt_active_time, alt_inactive_time, alt_oneshot, alt_turnoff,
  c, d, t, s, activeIsOn, inactiveIsOn
} from '../config/constants.js';
import { startTimer } from './timers.js';
import { getIndexFromId } from '../utils/getIndexFromId.js';
import { animationIn, animationOut } from '../utils/domUtils.js';

export function resetSlot(i) {
  if (i < 0 || i > 3) return;
  c[i] = d[i] = 0;
  t[i] = s[i] = null;
  activeIsOn[i] = inactiveIsOn[i] = alt_turnoff[i] = false;
}

export function stopTimeCount(id) {
  const i = getIndexFromId(id);
  if (i === -1) return;
  resetSlot(i);
  animationOut(id);
}

export function activeCount(id) {
  const i = getIndexFromId(id);
  startTimer(i, c, t, alt_active_time, () => {
    stopTimeCount(id);
    startInactiveCount(id);
  });
}

export function inactiveCount(id) {
  const i = getIndexFromId(id);
  startTimer(i, d, s, alt_inactive_time, () => {
    d[i] = 0;
    clearTimeout(s[i]);
    inactiveIsOn[i] = false;
    startActiveCount(id);
  });
}

export function startActiveCount(id) {
  const i = getIndexFromId(id);
  if (i === -1 || activeIsOn[i]) return;
  activeIsOn[i] = true;
  activeCount(id);
  animationIn(id);
}

export function startInactiveCount(id) {
  const i = getIndexFromId(id);
  if (i === -1 || inactiveIsOn[i]) return;

  inactiveIsOn[i] = true;
  if (alt_oneshot[i]) {
    alt_turnoff[i] = true;
  } else {
    inactiveCount(id);
  }
  animationOut(id);
}
