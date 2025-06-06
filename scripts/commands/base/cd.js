const cd = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const targetArg = args[0] || "/";
  let targetPath = vfsManager.resolvePath(targetArg, cwd);

  // Prevent navigation above root
  if (targetPath === "" || targetPath === "//") targetPath = "/";

  const target = await vfsManager.getNode(targetPath);

  if (!target) return `cd: no such file or directory: ${targetArg}`;
  if (target.type !== "dir") return `cd: not a directory: ${targetArg}`;

  shellState.cwd = targetPath;
  return "";
};

export default cd;
