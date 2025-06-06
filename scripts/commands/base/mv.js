const mv = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const [srcArg, destArg] = args;
  if (!srcArg || !destArg) return "mv: missing file operand";

  const srcPath = vfsManager.resolvePath(srcArg, cwd);
  const destPath = vfsManager.resolvePath(destArg, cwd);

  // Get source node and its parent
  const srcParts = srcPath.split('/').filter(Boolean);
  const srcName = srcParts.pop();
  const srcParentPath = '/' + srcParts.join('/');
  const srcParent = await vfsManager.getNode(srcParentPath);
  if (!srcParent || !srcParent.children || !srcParent.children[srcName])
    return `mv: cannot stat '${srcArg}': No such file or directory`;
  const node = srcParent.children[srcName];

  // Get destination parent and name
  let destParent, destName;
  const destNode = await vfsManager.getNode(destPath);
  if (destNode && destNode.type === "dir") {
    // Move into directory
    destParent = destNode;
    destName = node.name;
  } else {
    const destParts = destPath.split('/').filter(Boolean);
    destName = destParts.pop();
    const destParentPath = '/' + destParts.join('/');
    destParent = await vfsManager.getNode(destParentPath);
  }
  if (!destParent || !destParent.children) return "mv: destination path invalid";
  if (destParent.children[destName]) return `mv: cannot move '${srcArg}': Destination exists`;

  // Move node
  node.name = destName;
  destParent.children[destName] = node;
  delete srcParent.children[srcName];
  return "";
};

export default mv;
