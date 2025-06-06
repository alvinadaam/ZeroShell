const cp = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const [srcArg, destArg] = args;
  if (!srcArg || !destArg) return "cp: missing file operand";

  const srcPath = vfsManager.resolvePath(srcArg, cwd);
  const destPath = vfsManager.resolvePath(destArg, cwd);

  // Get source node
  const srcNode = await vfsManager.getNode(srcPath);
  if (!srcNode) return `cp: cannot stat '${srcArg}': No such file`;
  if (srcNode.type !== "file") return `cp: '${srcArg}': Not a file`;

  // Get destination parent and name
  let destParent, destName;
  const destNode = await vfsManager.getNode(destPath);
  if (destNode && destNode.type === "dir") {
    destParent = destNode;
    destName = srcNode.name;
  } else {
    const destParts = destPath.split('/').filter(Boolean);
    destName = destParts.pop();
    const destParentPath = '/' + destParts.join('/');
    destParent = await vfsManager.getNode(destParentPath);
  }
  if (!destParent || !destParent.children) return "cp: destination path invalid";
  if (destParent.children[destName]) return `cp: cannot copy to '${destName}': Destination exists`;

  destParent.children[destName] = {
    ...JSON.parse(JSON.stringify(srcNode)),
    name: destName,
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  };
  return "";
};

export default cp;
