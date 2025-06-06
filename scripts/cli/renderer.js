const renderer = {
  print(output, isHtml = true) {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;
    if (output === "__CLEAR__") {
      terminalOutput.innerHTML = "";
      return;
    }
    const div = document.createElement('div');
    div.innerHTML = (output || "").trim();
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  },
  printSuggestion(suggestion) {
    const input = document.getElementById('command-input');
    if (input) {
      input.value = suggestion;
      input.setSelectionRange(suggestion.length, suggestion.length);
    }
  }
};

export default renderer;
