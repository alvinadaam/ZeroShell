import { formatError, escapeHTML } from '../../tools/utils.js';

const file = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const fileArg = args[0];
  if (!fileArg) return formatError("file: missing file name");
  const filePath = vfsManager.resolvePath(fileArg, cwd);
  const node = await vfsManager.getNode(filePath);

  if (!node) return formatError(`file: ${escapeHTML(fileArg)}: No such file`);
  if (node.type !== "file") return formatError(`file: ${escapeHTML(fileArg)}: Not a file`);

  return `<span class="cli-info">File:</span> ${escapeHTML(node.name)}<br>` +
    `<span class="cli-info">Type:</span> ${escapeHTML(node.mime || "unknown")}<br>` +
    `<span class="cli-info">Size:</span> ${node.size} bytes`;
};

export default file;
