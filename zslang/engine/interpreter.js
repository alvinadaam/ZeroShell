// Minimal ZSLang interpreter core (v0.1)

import { parse } from './parser.js';
import { stdlib } from './stdlib/index.js';

export function runZSL(code, options = {}) {
  const lines = parse(code);
  for (const line of lines) {
    const tokens = line.trim().split(/\s+/);
    if (tokens[0] === 'print') {
      // Only support: print "something"
      const msg = tokens.slice(1).join(' ').replace(/^"|"$/g, '');
      if (options && typeof options.outputCb === 'function') {
        options.outputCb(msg);
      } else if (typeof window !== "undefined" && window.termOut) {
        window.termOut(msg);
      } else {
        console.log(msg);
      }
    }
    // Future: add more statements here
  }
}
