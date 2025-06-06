const pwd = async function(args, shellState, vfsManager) {
  return shellState.cwd || "/";
};

export default pwd;
