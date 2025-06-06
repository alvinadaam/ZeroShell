import { formatError, escapeHTML } from '../../tools/utils.js';

const view = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const fileArg = args[0];
  if (!fileArg) return formatError("view: missing file name");
  const filePath = vfsManager.resolvePath(fileArg, cwd);
  const node = await vfsManager.getNode(filePath);

  if (!node) return formatError(`view: ${escapeHTML(fileArg)}: No such file`);
  if (node.type !== "file") return formatError(`view: ${escapeHTML(fileArg)}: Not a file`);

  window.zeroshellViewer?.open(filePath, node.content ?? "", node.mime);
  return `Previewing <span class="cli-file">${escapeHTML(node.name)}</span>...`;
};

export default view;
