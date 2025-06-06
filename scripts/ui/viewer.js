// Minimal file viewer modal for ZeroShell

const viewerModalId = "zeroshell-viewer-modal";

function createViewerModal() {
  if (document.getElementById(viewerModalId)) return;
  const modal = document.createElement("div");
  modal.id = viewerModalId;
  modal.style = `
    position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%);
    background: #111; color: #33ff33; border: 2px solid #00ff44; border-radius: 8px;
    z-index: 10001; min-width: 340px; min-height: 160px; box-shadow: 0 0 24px #000;
    display: none; flex-direction: column; padding: 0;
  `;
  modal.innerHTML = `
    <div style="padding: 10px 16px; background:#181; border-radius:8px 8px 0 0; font-weight:bold; display:flex;align-items:center;">
      <span id="viewer-filename"></span>
      <button id="viewer-close" style="margin-left:auto;background:none;border:none;color:#fff;font-size:1.2em;cursor:pointer;">×</button>
    </div>
    <div id="viewer-content" style="flex:1; width:98%; min-height:100px; margin:10px 1%; background:#181; color:#33ff33; border:none; border-radius:4px; font-family:inherit; font-size:1em; overflow:auto; display:flex; align-items:center; justify-content:center;"></div>
    <div style="padding: 8px 16px; display:flex;justify-content:flex-end;">
      <button id="viewer-close-btn" style="background:#222;color:#fff;padding:4px 14px;border:none;border-radius:4px;cursor:pointer;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function isImageContent(content, mime, filename) {
  if (mime && mime.startsWith("image/")) return true;
  if (typeof content === "string" && content.startsWith("data:image/")) return true;
  if (typeof filename === "string" && /\.(png|jpg|jpeg|gif|bmp)$/i.test(filename)) return true;
  return false;
}

function highlightText(text) {
  // Basic syntax highlighting for code/text files
  // Highlight numbers, strings, and keywords (let, print, if, for, end, func)
  let html = escapeHTML(text)
    .replace(/"(.*?)"/g, '<span style="color:#00bfff;">"$1"</span>')
    .replace(/\b(let|print|if|for|end|func|input)\b/g, '<span style="color:#00ff44;">$1</span>')
    .replace(/\b\d+\b/g, '<span style="color:#ffb300;">$&</span>');
  return `<pre style="margin:0; background:none; color:inherit; font-family:inherit; font-size:1em;">${html}</pre>`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s])
  );
}

const viewer = {
  open(filePath, content, mime) {
    createViewerModal();
    const modal = document.getElementById(viewerModalId);
    const filenameSpan = modal.querySelector("#viewer-filename");
    const contentDiv = modal.querySelector("#viewer-content");
    const closeBtn = modal.querySelector("#viewer-close");
    const closeBtn2 = modal.querySelector("#viewer-close-btn");

    filenameSpan.textContent = filePath;

    // Detect image by mime, base64 header, or file extension
    if (isImageContent(content, mime, filePath)) {
      contentDiv.innerHTML = `<img src="${content}" alt="${filePath}" style="max-width:100%;max-height:320px;display:block;margin:auto;border-radius:6px;box-shadow:0 0 12px #00ff44cc;">`;
    } else {
      // Show text with basic syntax highlighting for code/text
      contentDiv.innerHTML = highlightText(content);
    }
    modal.style.display = "flex";

    function closeViewer() {
      modal.style.display = "none";
      contentDiv.innerHTML = "";
    }

    closeBtn.onclick = closeBtn2.onclick = closeViewer;

    modal.onkeydown = (e) => {
      if (e.key === "Escape") closeViewer();
    };

    modal.focus();
  }
};

window.zeroshellViewer = viewer;
export default viewer;
