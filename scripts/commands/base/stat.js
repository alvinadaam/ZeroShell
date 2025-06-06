import { escapeHTML, formatError } from '../../tools/utils.js';

const stat = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  if (!args[0]) return formatError("stat: missing file or directory name");
  const targetPath = vfsManager.resolvePath(args[0], cwd);
  const node = await vfsManager.getNode(targetPath);

  if (!node) return formatError(`stat: ${escapeHTML(args[0])}: No such file or directory`);

  let out = `<span class="cli-info">Name:</span> ${escapeHTML(node.name)}<br>`;
  out += `<span class="cli-info">Type:</span> ${node.type}<br>`;
  out += `<span class="cli-info">Created:</span> ${node.created}<br>`;
  out += `<span class="cli-info">Modified:</span> ${node.modified}<br>`;
  if (node.type === "file") out += `<span class="cli-info">Size:</span> ${node.size}<br>`;
  if (node.permissions) {
    out += `<span class="cli-info">Permissions:</span> `;
    out += Object.entries(node.permissions)
      .map(([role, perm]) => `${escapeHTML(role)}=${perm}`)
      .join(' ');
  }
  return out;
};

export default stat;
