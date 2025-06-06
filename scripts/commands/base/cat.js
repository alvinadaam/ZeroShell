import { formatError, escapeHTML } from '../../tools/utils.js';

const cat = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const filePath = vfsManager.resolvePath(args[0], cwd);
  const node = await vfsManager.getNode(filePath);

  if (!node) return formatError(`cat: ${escapeHTML(args[0])}: No such file or directory`);
  if (node.type !== "file") return formatError(`cat: ${escapeHTML(args[0])}: Not a file`);

  return node.content && node.content.length > 0 ? escapeHTML(node.content) : "(empty file)";
};

export default cat;
