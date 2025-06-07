// Minimal array stdlib for ZSLang

export const array = {
  push: (arr, val) => { arr.push(val); return arr; },
  pop: (arr) => arr.pop(),
  shift: (arr) => arr.shift(),
  unshift: (arr, val) => { arr.unshift(val); return arr; },
  length: (arr) => arr.length
};
