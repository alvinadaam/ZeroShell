import { formatError, escapeHTML } from '../../tools/utils.js';

function applyPermission(node, role, value) {
  if (!node.permissions) node.permissions = {};
  node.permissions[role] = value;
  if (node.type === "dir" && node.children) {
    for (const child of Object.values(node.children)) {
      applyPermission(child, role, value);
    }
  }
}

const chmod = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const [role, valueStr, targetArg] = args;
  if (!role || !valueStr || !targetArg) {
    return formatError("chmod: usage: chmod [role] [value] [file/dir]");
  }
  const value = parseInt(valueStr, 10);
  if (!["admin", "user", "all"].includes(role)) {
    return formatError("chmod: invalid role (must be admin, user, or all)");
  }
  if (![1, 3, 5].includes(value)) {
    return formatError("chmod: invalid value (must be 1, 3, or 5)");
  }
  const targetPath = vfsManager.resolvePath(targetArg, cwd);
  const node = await vfsManager.getNode(targetPath);
  if (!node) {
    return formatError(`chmod: ${escapeHTML(targetArg)}: No such file or directory`);
  }
  applyPermission(node, role, value);
  return "";
};

export default chmod;
