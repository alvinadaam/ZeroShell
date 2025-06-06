import { formatError, escapeHTML } from '../../tools/utils.js';

const rm = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const fileArg = args[0];
  if (!fileArg) return formatError("rm: missing file name");

  const filePath = vfsManager.resolvePath(fileArg, cwd);
  const parts = filePath.split('/').filter(Boolean);
  const fileName = parts.pop();
  const parentPath = '/' + parts.join('/');
  const parent = await vfsManager.getNode(parentPath);

  if (!parent || parent.type !== "dir") return formatError("rm: not a directory");
  const node = parent.children[fileName];
  if (!node) return formatError(`rm: cannot remove '${escapeHTML(fileArg)}': No such file`);
  if (node.type !== "file") return formatError(`rm: cannot remove '${escapeHTML(fileArg)}': Not a file`);
  delete parent.children[fileName];
  return "";
};

export default rm;
