import { formatError, escapeHTML } from '../../tools/utils.js';

const rmdir = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const dirArg = args[0];
  if (!dirArg) return formatError("rmdir: missing directory name");

  const dirPath = vfsManager.resolvePath(dirArg, cwd);
  const parts = dirPath.split('/').filter(Boolean);
  const dirName = parts.pop();
  const parentPath = '/' + parts.join('/');
  const parent = await vfsManager.getNode(parentPath);

  if (!parent || !parent.children || !parent.children[dirName])
    return formatError(`rmdir: failed to remove '${escapeHTML(dirArg)}': No such directory`);
  const node = parent.children[dirName];
  if (node.type !== "dir") return formatError(`rmdir: failed to remove '${escapeHTML(dirArg)}': Not a directory`);
  if (Object.keys(node.children).length > 0) return formatError(`rmdir: failed to remove '${escapeHTML(dirArg)}': Directory not empty`);
  delete parent.children[dirName];
  return "";
};

export default rmdir;
