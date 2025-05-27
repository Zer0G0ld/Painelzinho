// validation.js

/**
 * Valida se um valor é uma string não vazia
 * @param {string} value
 * @returns {boolean}
 */
export function validateNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Valida se um valor é um número dentro de um intervalo opcional
 * @param {any} value
 * @param {number} [min] valor mínimo (inclusive)
 * @param {number} [max] valor máximo (inclusive)
 * @returns {boolean}
 */
export function validateNumberInRange(value, min = -Infinity, max = Infinity) {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
}

/**
 * Valida um tempo ativo e inativo (exemplo baseado no seu uso)
 * Ativo >= 0, Inativo = 0
 * @param {number} activeTime
 * @param {number} inactiveTime
 * @returns {boolean}
 */
export function validateActiveInactiveTimes(activeTime, inactiveTime) {
  return (
    typeof activeTime === "number" &&
    typeof inactiveTime === "number" &&
    activeTime >= 0 &&
    inactiveTime === 0
  );
}

/**
 * Valida o estilo (assumindo que estilo é uma string numérica entre "1" e "3")
 * @param {string} style
 * @returns {boolean}
 */
export function validateStyle(style) {
  return ["1", "2", "3"].includes(style);
}

/**
 * Valida uma flag booleana (aceita string 'true'/'false', número 0/1, booleanos)
 * @param {any} value
 * @returns {boolean}
 */
export function validateBoolean(value) {
  if (typeof value === "boolean") return true;
  if (typeof value === "string")
    return value.toLowerCase() === "true" || value.toLowerCase() === "false";
  if (typeof value === "number") return value === 0 || value === 1;
  return false;
}

/**
 * Valida margens (exemplo: número entre 0 e 100)
 * @param {any} margin
 * @returns {boolean}
 */
export function validateMargin(margin) {
  return validateNumberInRange(margin, 0, 100);
}

/**
 * Valida se valor é válido para tamanho do logo (exemplo entre 0 e 20)
 * @param {any} logoSize
 * @returns {boolean}
 */
export function validateLogoSize(logoSize) {
  return validateNumberInRange(logoSize, 0, 20);
}
