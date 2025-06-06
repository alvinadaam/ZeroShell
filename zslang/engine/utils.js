// Utility helpers for ZSL engine

function isNumber(val) {
  return !isNaN(Number(val));
}

function isString(val) {
  return typeof val === "string";
}

export { isNumber, isString };
