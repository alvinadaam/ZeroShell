import shell from './cli/shell.js';
import renderer from './cli/renderer.js';
import bootScreen from './cli/bootScreen.js';
import { formatError, escapeHTML } from './tools/utils.js';
import { runAllTests } from './tests/testRunner.js';

async function getTabSuggestions(inputValue, cwd) {
  const tokens = inputValue.match(/^(\w+)(?:\s+(.+))?$/);
  if (!tokens) return [];
  const cmd = tokens[1];
  let partial = tokens[2] ? tokens[2].replace(/^"|"$/g, "") : "";
  // Add all commands that take a file/dir as argument
  const fileCommands = [
    "cd", "ls", "cat", "rm", "rmdir", "mv", "cp", "find", "edit", "stat", "run", "view", "chmod", "touch"
  ];
  if (!fileCommands.includes(cmd)) return [];

  let parentPath = cwd;
  let partialName = partial;
  if (partial.includes("/")) {
    const idx = partial.lastIndexOf("/");
    parentPath = shell.vfsManager.resolvePath(partial.slice(0, idx), cwd);
    partialName = partial.slice(idx + 1);
  }
  const vfs = await shell.vfsManager.getNode(parentPath);
  if (!vfs || !vfs.children) return [];
  let matches = Object.keys(vfs.children)
    .filter(name => name.startsWith(partialName))
    .map(name => ({
      name,
      type: vfs.children[name].type,
      full: (partial.includes("/") ? partial.slice(0, partial.lastIndexOf("/") + 1) : "") + name
    }));

  // For run/edit/view, prefer .zs/.zsl/.png files, but show all if partial is present
  if (["run", "edit"].includes(cmd)) {
    if (!partialName) {
      matches = matches.filter(item => item.name.endsWith('.zs') || item.name.endsWith('.zsl'));
    }
  }
  if (cmd === "view") {
    if (!partialName) {
      matches = matches.filter(item =>
        item.name.endsWith('.png') ||
        item.name.endsWith('.jpg') ||
        item.name.endsWith('.jpeg') ||
        item.name.endsWith('.gif') ||
        item.name.endsWith('.bmp') ||
        item.name.endsWith('.txt') ||
        item.name.endsWith('.zs') ||
        item.name.endsWith('.zsl')
      );
    }
  }
  return matches;
}

document.addEventListener('DOMContentLoaded', async () => {
  await bootScreen.show();
  bootScreen.hide();
  const input = document.getElementById('command-input');
  const promptSpan = document.querySelector('.prompt');
  if (input && promptSpan) {
    renderer.print("Welcome to ZeroShell! Type 'help' to get started.");
    promptSpan.textContent = shell.getPrompt();

    let lastSuggestions = [];
    let lastTabValue = "";

    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        lastSuggestions = [];
        lastTabValue = "";
        const value = input.value.trim();
        renderer.print(`<span style="color:#00ff44">${shell.getPrompt()} ${escapeHTML(value)}</span>`, true);
        if (value) {
          let output = await shell.handleInput(value);
          const isHtml = /<span/.test(output);
          renderer.print(output, isHtml);
          input.value = '';
          promptSpan.textContent = shell.getPrompt();
          if (value === 'shutdown') {
            bootScreen.shutdown();
            input.disabled = true;
          }
        }
        setTimeout(() => input.focus(), 0);
      } else if (e.key === 'ArrowUp') {
        input.value = shell.getHistory('up');
        setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
      } else if (e.key === 'ArrowDown') {
        input.value = shell.getHistory('down');
        setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const value = input.value;
        const cwd = shell.state.cwd || "/";
        const suggestions = await getTabSuggestions(value, cwd);
        if (suggestions.length === 1) {
          // Complete the input
          const cmd = value.split(/\s+/)[0];
          let completed = cmd + ' "' + suggestions[0].full + (suggestions[0].type === "dir" ? "/" : "") + '"';
          input.value = completed;
          setTimeout(() => input.setSelectionRange(completed.length, completed.length), 0);
          lastSuggestions = [];
          lastTabValue = "";
        } else if (suggestions.length > 1) {
          lastSuggestions = suggestions;
          lastTabValue = value;
          renderer.print(
            `<span class="tab-suggestion">Suggestions: ${suggestions.map(item =>
              `<span style="color:${item.type === "dir" ? "#00ff44" : "#33ff33"}">${escapeHTML(item.name)}${item.type === "dir" ? "/" : ""}</span>`
            ).join('  ')}</span>`,
            true
          );
        }
      }
    });

    // Optional: allow clicking on the terminal to focus input
    document.getElementById('terminal').addEventListener('click', () => {
      input.focus();
    });
  }
});

async function onUserInput(input) {
  renderer.print(`<span style="color:#00ff44">${shell.getPrompt()} ${escapeHTML(input)}</span>`, true);
  let output = await shell.handleInput(input);
  const isHtml = /<span/.test(output);
  renderer.print(output, isHtml);
  document.querySelector('.prompt').textContent = shell.getPrompt();
  setTimeout(() => document.getElementById('command-input').focus(), 0);
}

window.zeroshell = { onUserInput };
window.runTests = runAllTests;
