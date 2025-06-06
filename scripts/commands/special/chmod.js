import { formatError, escapeHTML } from '../../tools/utils.js';

const VALID_ROLES = ["admin", "user", "all"];
const VALID_VALUES = ["1", "3", "5"];

const chmod = async function(args, shellState, vfsManager) {
  const role = args[0];
  const value = args[1];
  const targetArg = args[2];
  const cwd = shellState.cwd || "/";

  if (shellState.currentUser !== "admin") {
    return formatError("chmod: only admin can change permissions");
  }

  if (!role || !value || !targetArg) {
    return formatError("chmod: usage: chmod [role] [value] [file/dir]");
  }
  if (!VALID_ROLES.includes(role)) {
    return formatError(`chmod: invalid role '${escapeHTML(role)}'`);
  }
  if (!VALID_VALUES.includes(value)) {
    return formatError(`chmod: invalid value '${escapeHTML(value)}' (use 1, 3, or 5)`);
  }

  const targetPath = vfsManager.resolvePath(targetArg, cwd);
  const node = await vfsManager.getNode(targetPath);
  if (!node) return formatError(`chmod: ${escapeHTML(targetArg)}: No such file or directory`);

  function applyPerm(n) {
    if (!n.permissions) n.permissions = { admin: 3, user: 3, all: 1 };
    n.permissions[role] = Number(value);
    if (n.type === "dir" && n.children) {
      for (const child of Object.values(n.children)) {
        applyPerm(child);
      }
    }
  }
  applyPerm(node);

  return `Set ${role} permission to ${value} for ${escapeHTML(targetArg)}`;
};

export default chmod;
