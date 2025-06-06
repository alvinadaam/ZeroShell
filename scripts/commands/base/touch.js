import { formatError, escapeHTML } from '../../tools/utils.js';

const touch = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const fileArg = args[0];

  if (
    !fileArg ||
    typeof fileArg !== "string" ||
    fileArg.trim() === "" ||
    fileArg === '""' ||
    fileArg === "." ||
    fileArg === ".."
  ) {
    return formatError("touch: invalid file name");
  }

  // Support absolute/relative paths
  const filePath = vfsManager.resolvePath(fileArg, cwd);
  const parts = filePath.split('/').filter(Boolean);
  const fileName = parts.pop();
  const parentPath = '/' + parts.join('/');
  const parent = await vfsManager.getNode(parentPath);

  if (!parent || parent.type !== "dir") return formatError("touch: not a directory");

  let node = parent.children[fileName];
  const now = new Date().toISOString();

  if (node && node.type === "dir") {
    return formatError(`touch: cannot create file '${escapeHTML(fileName)}': Directory exists`);
  }

  if (node && node.type === "file") {
    node.modified = now;
    return "";
  }

  parent.children[fileName] = {
    type: "file",
    name: fileName,
    created: now,
    modified: now,
    size: 0,
    content: ""
  };
  return "";
};

export default touch;
