// Native command layer for ZSL

function runNativeCommand(cmd, args, vars, outputCb) {
  if (cmd === "ls" && typeof window.shellState !== "undefined" && window.shellState.runCommand) {
    window.shellState.runCommand("ls", [], outputCb);
    return 0;
  }
  if (cmd === "pwd" && typeof window.shellState !== "undefined" && window.shellState.runCommand) {
    window.shellState.runCommand("pwd", [], outputCb);
    return 0;
  }
  // Add more native commands as needed
  return 0;
}

export { runNativeCommand };
