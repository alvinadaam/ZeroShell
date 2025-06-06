// Main ZSL interpreter runtime

import { parseLines, tokenize } from './parser.js';
import { builtins } from './builtins.js';
import { runNativeCommand } from './native.js';
import { handleImport } from './modules.js';

async function runZSL(code, inputCb = null, outputCb = null, imported = new Set(), globalVars = {}) {
  const lines = parseLines(code);
  let pc = 0;
  const vars = globalVars;
  const stack = [];
  let output = [];
  const functions = {};
  let callStack = [];

  // Library objects
  vars.gfxlib = vars.gfxlib || {};
  vars.mathlib = vars.mathlib || {};
  vars.gamelib = vars.gamelib || {};

  // Import system
  for (let i = 0; i < lines.length; i++) {
    if (await handleImport(lines[i], imported, vars)) lines[i] = "";
  }

  // Function parsing (same as before)
  for (let i = 0; i < lines.length; i++) {
    const funcMatch = lines[i].match(/^func\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+([a-zA-Z0-9_ ]+))?/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      const params = funcMatch[2] ? funcMatch[2].split(/\s+/).filter(Boolean) : [];
      let body = [];
      let depth = 1;
      let j = i + 1;
      for (; j < lines.length; j++) {
        if (lines[j].startsWith('func ')) depth++;
        if (lines[j] === 'end') depth--;
        if (depth === 0) break;
        body.push(lines[j]);
      }
      functions[funcName] = { params, body };
      for (let k = i; k <= j; k++) lines[k] = "";
      i = j;
    }
  }

  async function execLine(line) {
    const tokens = tokenize(line);
    if (tokens.length === 0) return;

    // Native command
    if (tokens[0] === 'native' && tokens.length > 1) {
      runNativeCommand(tokens[1], tokens.slice(2), vars, outputCb);
      return;
    }

    // Built-in print
    if (tokens[0] === 'print') {
      const val = tokens.slice(1).join(' ');
      if (outputCb) outputCb(val);
      output.push(val);
      return;
    }

    // TODO: Add more statement handling (let, input, control flow, etc.)
  }

  while (pc < lines.length) {
    await execLine(lines[pc]);
    pc++;
  }
  return output;
}

export { runZSL };
