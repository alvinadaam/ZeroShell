import { formatError, escapeHTML } from '../../tools/utils.js';

const edit = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const fileArg = args[0];
  if (!fileArg) return formatError("edit: missing file name");
  const filePath = vfsManager.resolvePath(fileArg, cwd);
  const node = await vfsManager.getNode(filePath);

  if (!node) return formatError(`edit: ${escapeHTML(fileArg)}: No such file`);
  if (node.type !== "file") return formatError(`edit: ${escapeHTML(fileArg)}: Not a file`);

  // Permission check: allow admin or user with write permission
  const user = shellState.user || "user";
  // Permission check for editing
  const parentPath = filePath.split('/').slice(0, -1).join('/') || '/';
  const parentNode = await vfsManager.getNode(parentPath);
  const perm = parentNode?.permissions?.[user] ?? parentNode?.permissions?.all ?? 0;
  if (user !== "admin" && perm < 1) {
    return `edit: permission denied`;
  }

  window.zeroshellEditor?.open(filePath, node.content ?? "", async (newContent) => {
    node.content = newContent;
    node.modified = new Date().toISOString();
    node.size = newContent.length;
  });

  return `Editing <span class="cli-file">${escapeHTML(node.name)}</span>...`;
};

export default edit;
