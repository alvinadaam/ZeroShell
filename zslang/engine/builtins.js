// Built-in functions and libraries for ZSL

const builtins = {
  // Add built-in functions here as needed
  print: (args, vars, outputCb) => {
    if (outputCb) outputCb(args.join(' '));
  }
  // Add more built-ins as needed
};

export { builtins };
