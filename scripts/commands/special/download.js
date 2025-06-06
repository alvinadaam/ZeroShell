import { formatError, escapeHTML } from '../../tools/utils.js';

const download = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const fileArg = args[0];
  if (!fileArg) return formatError("download: missing file name");
  const filePath = vfsManager.resolvePath(fileArg, cwd);
  const node = await vfsManager.getNode(filePath);

  if (!node) return formatError(`download: ${escapeHTML(fileArg)}: No such file`);
  if (node.type !== "file") return formatError(`download: ${escapeHTML(fileArg)}: Not a file`);

  // Download as base64 or text
  let link = document.createElement('a');
  link.download = node.name;
  if (node.mime && node.content.startsWith('data:')) {
    link.href = node.content;
  } else if (node.mime && node.mime.startsWith('text/')) {
    link.href = 'data:' + node.mime + ';charset=utf-8,' + encodeURIComponent(node.content);
  } else {
    // fallback: treat as octet-stream
    link.href = 'data:application/octet-stream;base64,' + btoa(node.content);
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return `Downloaded <span class="cli-file">${escapeHTML(node.name)}</span>`;
};

export default download;
