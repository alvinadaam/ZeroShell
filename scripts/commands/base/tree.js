const tree = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const pathArg = args[0] ? vfsManager.resolvePath(args[0], cwd) : cwd;
  const startNode = await vfsManager.getNode(pathArg);

  function walk(node, prefix = "") {
    let out = prefix + node.name + (node.type === "dir" ? "/" : "") + "\n";
    if (node.type === "dir" && node.children) {
      for (const child of Object.values(node.children)) {
        out += walk(child, prefix + "  ");
      }
    }
    return out;
  }

  if (!startNode) return "tree: directory not found";
  return walk(startNode, "");
};

export default tree;
