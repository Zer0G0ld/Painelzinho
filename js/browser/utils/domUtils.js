export function animationIn(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('animate-in');
}

export function animationOut(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('animate-in');
  el.classList.add('animate-out');
}
