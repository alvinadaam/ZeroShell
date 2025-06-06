const find = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const name = args[0];
  if (!name) return "find: missing name";
  const root = await vfsManager.getNode(cwd);
  if (!root) return "find: current directory not found";

  const results = [];
  function search(node, path) {
    if (node.name === name) results.push(path);
    if (node.type === "dir" && node.children) {
      for (const childName in node.children) {
        const child = node.children[childName];
        search(child, path + (path === "/" ? "" : "/") + child.name);
      }
    }
  }
  search(root, cwd === "/" ? "/" : cwd);
  return results.length ? results.join('\n') : "find: not found";
};

export default find;
