const clear = function(args, shellState, vfsManager) {
  // Signal to the renderer to clear output (handled in main.js or renderer.js)
  return "__CLEAR__";
};

export default clear;
