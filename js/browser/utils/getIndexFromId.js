export function getIndexFromId(id) {
  // Supondo que os IDs são "lower-third-1", "lower-third-2", etc.
  const match = id.match(/(\d+)/);
  return match ? parseInt(match[1], 10) - 1 : -1;
}
