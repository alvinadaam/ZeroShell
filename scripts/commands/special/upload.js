import { formatError, escapeHTML } from '../../tools/utils.js';

const upload = async function(args, shellState, vfsManager) {
  // Only works in browser with user interaction
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = async (e) => {
      const file = input.files[0];
      if (!file) {
        resolve(formatError("upload: no file selected"));
        input.remove();
        return;
      }
      const reader = new FileReader();
      reader.onload = async function(ev) {
        const base64 = ev.target.result;
        const cwd = shellState.cwd || "/";
        const filePath = vfsManager.resolvePath(file.name, cwd);
        await vfsManager.writeFile(filePath, base64, { mime: file.type, size: file.size });
        resolve(`Uploaded <span class="cli-file">${escapeHTML(file.name)}</span> (${file.type || "unknown"}, ${file.size} bytes)`);
        input.remove();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
};

export default upload;
