const whoami = async function(args, shellState, vfsManager) {
  return shellState.currentUser || "user";
};

export default whoami;
