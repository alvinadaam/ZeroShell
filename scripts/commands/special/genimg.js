import { formatError, escapeHTML } from '../../tools/utils.js';

function randomPngBase64(width = 64, height = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = Math.random() * 255;
    imgData.data[i+1] = Math.random() * 255;
    imgData.data[i+2] = Math.random() * 255;
    imgData.data[i+3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
}

const genimg = async function(args, shellState, vfsManager) {
  const cwd = shellState.cwd || "/";
  const fileName = args[0] || "random.png";
  if (!fileName.endsWith(".png")) return formatError("genimg: file must end with .png");
  const filePath = vfsManager.resolvePath(fileName, cwd);
  const parts = filePath.split('/').filter(Boolean);
  const name = parts.pop();
  const parentPath = '/' + parts.join('/');
  const parent = await vfsManager.getNode(parentPath);
  if (!parent || parent.type !== "dir") return formatError("genimg: not a directory");

  const base64 = randomPngBase64();
  parent.children[name] = {
    type: "file",
    name,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    size: base64.length,
    content: base64,
    mime: "image/png"
  };
  return `Generated <span class="cli-file">${escapeHTML(name)}</span> (random PNG)`;
};

export default genimg;
