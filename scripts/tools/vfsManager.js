let vfsData = null;

// Helper to normalize and split paths
function splitPath(path) {
  return path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
}

// Helper: detect mime type by extension
function getMimeType(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'bmp') return 'image/bmp';
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'zs' || ext === 'zsl') return 'text/plain';
  if (ext === 'txt' || ext === 'md') return 'text/plain';
  return 'application/octet-stream';
}

const vfsManager = {
  vfs: null,

  async load() {
    if (this.vfs) return this.vfs;
    if (!vfsData) {
      const res = await fetch('scripts/data/vfs.json');
      vfsData = await res.json();
    }
    // Deep clone to avoid mutation across tests
    this.vfs = JSON.parse(JSON.stringify(vfsData));
    return this.vfs;
  },

  async reset() {
    // Always reload and deep clone the original VFS
    const res = await fetch('scripts/data/vfs.json');
    vfsData = await res.json();
    this.vfs = JSON.parse(JSON.stringify(vfsData));
  },

  resolvePath(target, cwd) {
    if (!target) return cwd;
    let parts = [];
    if (target.startsWith('/')) {
      parts = splitPath(target);
    } else {
      parts = splitPath(cwd).concat(splitPath(target));
    }
    // Handle . and ..
    const resolved = [];
    for (const part of parts) {
      if (part === '' || part === '.') continue;
      if (part === '..') {
        if (resolved.length > 0) resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  },

  async getNode(pathStr) {
    const vfs = await this.load();
    if (pathStr === '/' || pathStr === '') return vfs;
    const parts = splitPath(pathStr);
    let node = vfs;
    for (const part of parts) {
      if (!node.children || !node.children[part]) return null;
      node = node.children[part];
    }
    return node;
  },

  async deleteNode(pathStr) {
    const vfs = await this.load();
    if (pathStr === '/' || pathStr === '') return false;
    const parts = splitPath(pathStr);
    const name = parts.pop();
    let parent = vfs;
    for (const part of parts) {
      if (!parent.children || !parent.children[part]) return false;
      parent = parent.children[part];
    }
    if (parent.children && parent.children[name]) {
      delete parent.children[name];
      return true;
    }
    return false;
  },

  // Write or overwrite a file (supports base64 for binary)
  async writeFile(pathStr, content, opts = {}, user = "user") {
    const vfs = await this.load();
    const parts = splitPath(pathStr);
    const name = parts.pop();
    let parent = vfs;
    for (const part of parts) {
      if (!parent.children || !parent.children[part]) return false;
      parent = parent.children[part];
    }
    // Permission check: allow if user is admin or has write permission
    const perm = parent.permissions?.[user] ?? parent.permissions?.all ?? 0;
    if (user !== "admin" && perm < 1) return false;
    parent.children[name] = {
      type: "file",
      name,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      size: typeof content === "string" ? content.length : (opts.size || 0),
      content,
      mime: opts.mime || getMimeType(name)
    };
    return true;
  },

  // For binary: read as base64 string
  async readFile(pathStr) {
    const node = await this.getNode(pathStr);
    if (!node || node.type !== "file") return null;
    return node.content;
  }
};

export default vfsManager;
