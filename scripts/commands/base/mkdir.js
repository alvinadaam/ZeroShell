import { formatError, escapeHTML } from '../../tools/utils.js';

const mkdir = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const dirArg = args[0];

  if (
    !dirArg ||
    typeof dirArg !== "string" ||
    dirArg.trim() === "" ||
    dirArg === '""' ||
    dirArg === "." ||
    dirArg === ".."
  ) {
    return formatError("mkdir: invalid directory name");
  }

  // Support absolute/relative paths
  const dirPath = vfsManager.resolvePath(dirArg, cwd);
  const parts = dirPath.split('/').filter(Boolean);
  const dirName = parts.pop();
  const parentPath = '/' + parts.join('/');
  const parent = await vfsManager.getNode(parentPath);

  if (!parent || parent.type !== "dir") return formatError("mkdir: not a directory");
  if (parent.children[dirName]) return formatError(`mkdir: cannot create directory '${escapeHTML(dirName)}': File or directory exists`);

  parent.children[dirName] = {
    type: "dir",
    name: dirName,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    children: {}
  };
  return "";
};

export default mkdir;
