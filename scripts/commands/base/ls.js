import { escapeHTML } from '../../tools/utils.js';

const ls = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  let targetPath = cwd;
  let showMeta = false;
  let metaArg = null;

  // Support: ls [dir] and ls --m [name or path]
  if (args.length === 1 && args[0] !== '--m') {
    targetPath = vfsManager.resolvePath(args[0], cwd);
  } else if (args.length === 2 && args[0] === '--m') {
    showMeta = true;
    metaArg = args[1];
    targetPath = cwd;
  } else if (args.length > 2 || (args.length === 1 && args[0] === '--m')) {
    return `<span class="cli-error">Usage: ls [dir] OR ls --m [name]</span>`;
  }

  const vfs = await vfsManager.getNode(targetPath);

  if (!vfs) return `<span class="cli-error">Error: Directory not found.</span>`;
  if (vfs.type !== "dir") return `<span class="cli-error">ls: Not a directory</span>`;

  // ls --m [name or path]
  if (showMeta && metaArg) {
    const metaPath = vfsManager.resolvePath(metaArg, targetPath);
    const target = await vfsManager.getNode(metaPath);
    if (!target) return `<span class="cli-error">No such file or directory: ${escapeHTML(metaArg)}</span>`;
    let meta = `<span class="cli-info">Name:</span> ${escapeHTML(target.name)}<br><span class="cli-info">Type:</span> ${target.type}<br><span class="cli-info">Created:</span> ${target.created}<br><span class="cli-info">Modified:</span> ${target.modified}`;
    if (target.type === "file") meta += `<br><span class="cli-info">Size:</span> ${target.size}`;
    return meta;
  }

  // List: folders first (with /), then files
  const children = vfs.children || {};
  const dirs = [];
  const files = [];
  for (const name in children) {
    if (children[name].type === "dir") {
      if (!dirs.includes(name + "/")) dirs.push(`<span class="cli-dir">${escapeHTML(name)}/</span>`);
    } else {
      files.push(`<span class="cli-file">${escapeHTML(name)}</span>`);
    }
  }
  return [...dirs.sort(), ...files.sort()].join('  ');
};

export default ls;
