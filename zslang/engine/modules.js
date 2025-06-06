import vfsManager from '../../scripts/tools/vfsManager.js';

async function handleImport(line, imported, vars) {
  const importMatch = line.match(/^import\s+"([^"]+)"$/);
  if (importMatch) {
    const importPath = importMatch[1];
    if (!imported.has(importPath)) {
      imported.add(importPath);
      const node = await vfsManager.getNode(importPath);
      if (node && node.type === "file") {
        // This will call runZSL recursively (circular import safe)
        await window.ZSLEngine.runZSL(node.content, null, null, imported, vars);
      }
    }
    return true;
  }
  return false;
}

export { handleImport };
