const history = async function(args, shellState, vfsManager) {
  if (!shellState.history || shellState.history.length === 0) return "(no history)";
  return shellState.history.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
};

export default history;
