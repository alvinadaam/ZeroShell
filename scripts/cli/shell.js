import parser from './parser.js';
import vfsManager from '../tools/vfsManager.js';
import ls from '../commands/base/ls.js';
import help from '../commands/base/help.js';
import cd from '../commands/base/cd.js';
import cat from '../commands/base/cat.js';
import clear from '../commands/base/clear.js';
import mkdir from '../commands/base/mkdir.js';
import tree from '../commands/base/tree.js';
import touch from '../commands/base/touch.js';
import pwd from '../commands/base/pwd.js';
import shutdown from '../commands/special/shutdown.js';
import rm from '../commands/base/rm.js';
import rmdir from '../commands/base/rmdir.js';
import mv from '../commands/base/mv.js';
import cp from '../commands/base/cp.js';
import find from '../commands/base/find.js';
import historyCmd from '../commands/base/history.js';
import stat from '../commands/base/stat.js';
import whoami from '../commands/base/whoami.js';
import chmod from '../commands/special/chmod.js';
import su from '../commands/special/su.js';
import edit from '../commands/base/edit.js';
import run from '../commands/special/run.js';
import view from '../commands/special/view.js';
import genimg from '../commands/special/genimg.js';
import upload from '../commands/special/upload.js';
import download from '../commands/special/download.js';
import file from '../commands/special/file.js';
import zslstudio from '../ide/zslstudio.js';
import { showInputModal } from '../ui/inputModal.js';

// Aliases
const aliases = {
  dir: 'ls',
  md: 'mkdir'
};

const commands = {
  ls,
  help,
  cd,
  cat,
  clear,
  mkdir,
  tree,
  touch,
  pwd,
  shutdown,
  rm,
  rmdir,
  mv,
  cp,
  find,
  history: historyCmd,
  stat,
  whoami,
  chmod,
  su,
  edit,
  run,
  view,
  genimg,
  upload,
  download,
  file,
  zslstudio,
  // ...add more commands as needed
};

class Shell {
  constructor() {
    this.state = {
      cwd: '/',
      history: [],
      historyIndex: -1,
      currentUser: 'user'
    };
    this.vfsManager = vfsManager;
  }

  async handleInput(input) {
    if (!input.trim()) return "";
    this.state.history.push(input);
    this.state.historyIndex = this.state.history.length;
    const parsedCommands = parser(input);
    let output = '';
    for (const { command, args } of parsedCommands) {
      const cmd = aliases[command] || command;
      if (!Object.prototype.hasOwnProperty.call(commands, cmd)) {
        output += `Unknown command: ${command}\n`;
        break; // Stop on first error
      }
      try {
        const result = await commands[cmd](args, this.state, this.vfsManager);
        if (result) output += result + '\n';
      } catch (e) {
        output += `Error: ${e.message}\n`;
        break; // Stop on first error
      }
    }
    return output.trim();
  }

  getPrompt() {
    return `${this.state.cwd}$`;
  }

  getHistory(direction) {
    if (direction === 'up') {
      if (this.state.historyIndex > 0) this.state.historyIndex--;
    } else if (direction === 'down') {
      if (this.state.historyIndex < this.state.history.length - 1) this.state.historyIndex++;
      else this.state.historyIndex = this.state.history.length;
    }
    return this.state.history[this.state.historyIndex] || '';
  }
}

export default new Shell();

// Example: use showInputModal for CLI commands that need input
// Usage: await showInputModal({ prompt: "Enter something:" });
