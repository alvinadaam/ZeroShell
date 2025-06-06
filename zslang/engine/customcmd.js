// Custom Command System for ZSLang

import vfsManager from '../../scripts/tools/vfsManager.js';
import { runZSL } from './runtime.js';

const customCommands = {}; // name -> { args, body, doc }

async function loadCustomCommands() {
  // Load all .zscmd files from VFS root or a dedicated folder
  const files = await vfsManager.list('/zslang/cmds');
  for (const file of files) {
    if (file.type === 'file' && file.name.endsWith('.zscmd')) {
      const content = file.content || '';
      parseAndRegisterCustomCommand(content, file.name.replace(/\.zscmd$/, ''));
    }
  }
}

function parseAndRegisterCustomCommand(content, nameOverride = null) {
  // Parse command definition from file content
  // Syntax: command <name> [args...] ... end
  const lines = content.split('\n').map(l => l.trim());
  let doc = '';
  let name = nameOverride;
  let args = [];
  let body = [];
  let inCmd = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#')) {
      doc += line.replace(/^#\s?/, '') + '\n';
      continue;
    }
    if (line.startsWith('command ')) {
      inCmd = true;
      const m = line.match(/^command\s+([a-zA-Z_][a-zA-Z0-9_]*)(.*)$/);
      if (m) {
        name = m[1];
        args = m[2].trim().replace(/[\[\]]/g, '').split(/\s+/).filter(Boolean);
      }
      continue;
    }
    if (line === 'end' && inCmd) {
      break;
    }
    if (inCmd) {
      body.push(line);
    }
  }
  if (name) {
    customCommands[name] = { args, body, doc: doc.trim() };
  }
}

function getCustomCommand(name) {
  return customCommands[name];
}

function listCustomCommands() {
  return Object.keys(customCommands);
}

async function execCustomCommand(name, argv, shellContext) {
  const cmd = getCustomCommand(name);
  if (!cmd) return `Command not found: ${name}`;
  // Build a vars object with arguments
  const vars = Object.assign({}, shellContext?.vars || {});
  cmd.args.forEach((arg, i) => vars[arg] = argv[i] || '');
  // Run the command body as ZSL code
  const code = cmd.body.join('\n');
  return await runZSL(code, shellContext?.inputCb, shellContext?.outputCb, new Set(), vars);
}

export { loadCustomCommands, parseAndRegisterCustomCommand, getCustomCommand, listCustomCommands, execCustomCommand };
