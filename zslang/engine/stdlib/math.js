// Minimal math stdlib for ZSLang

export const math = {
  add: (a, b) => Number(a) + Number(b),
  sub: (a, b) => Number(a) - Number(b),
  mul: (a, b) => Number(a) * Number(b),
  div: (a, b) => Number(a) / Number(b),
  mod: (a, b) => Number(a) % Number(b),
  sqrt: (a) => Math.sqrt(Number(a)),
  pow: (a, b) => Math.pow(Number(a), Number(b)),
  pi: Math.PI
};
