// Main ZSL interpreter runtime

import { parseLines, tokenize } from './parser.js';
import { builtins } from './builtins.js';
import { runNativeCommand } from './native.js';
import { handleImport } from './modules.js';
import { runInBackground, listJobs, getJob } from './async.js';
import { onEvent, triggerEvent, eventHooks } from './events.js';
import { execCustomCommand, getCustomCommand, listCustomCommands, loadCustomCommands } from './customcmd.js';

async function runZSL(code, inputCb = null, outputCb = null, imported = new Set(), globalVars = {}, shellContext = {}) {
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

  // Load custom commands on first run (if not already loaded)
  if (!globalVars.__customCmdsLoaded) {
    await loadCustomCommands();
    globalVars.__customCmdsLoaded = true;
  }

  async function execLine(line) {
    const tokens = tokenize(line);
    if (tokens.length === 0) return;

    // Custom command execution
    if (getCustomCommand(tokens[0])) {
      await execCustomCommand(tokens[0], tokens.slice(1), { vars: globalVars, inputCb, outputCb });
      return;
    }

    // Async/background jobs
    if (tokens[0] === 'async' && tokens[1] === 'run') {
      // Example: async run myscript.zs
      const scriptPath = tokens[2];
      runInBackground(async () => {
        const node = await window.vfsManager.getNode(scriptPath);
        if (node && node.type === "file") {
          await runZSL(node.content, inputCb, outputCb, imported, globalVars);
        }
      });
      if (outputCb) outputCb(`Started background job for ${scriptPath}`);
      return;
    }
    if (tokens[0] === 'jobs') {
      // List background jobs
      const jobs = listJobs();
      if (outputCb) outputCb(jobs.map(j => `Job ${j.id}: ${j.status}`).join('\n'));
      return;
    }

    // Events and hooks
    if (tokens[0] === 'on' && tokens[1] === 'event' && tokens[2]) {
      // Example: on event "file_created"
      const eventName = tokens[2].replace(/"/g, '');
      let body = [];
      let i = 1;
      while (lines[pc + i] && lines[pc + i].trim() !== 'end') {
        body.push(lines[pc + i]);
        i++;
      }
      onEvent(eventName, async (...args) => {
        for (const l of body) await execLine(l);
      });
      pc += i; // Skip event body
      return;
    }
    if (tokens[0] === 'trigger' && tokens[1]) {
      // Example: trigger file_created
      triggerEvent(tokens[1]);
      return;
    }

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
