const editorModalId = "zeroshell-editor-modal";

function createEditorModal() {
  if (document.getElementById(editorModalId)) return;
  const modal = document.createElement("div");
  modal.id = editorModalId;
  modal.style = `
    position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%);
    background: #111; color: #33ff33; border: 2px solid #00ff44; border-radius: 8px;
    z-index: 10001; min-width: 340px; min-height: 220px; box-shadow: 0 0 24px #000;
    display: none; flex-direction: column; padding: 0;
  `;
  modal.innerHTML = `
    <div class="editor-header" style="padding: 10px 16px; background:#181; border-radius:8px 8px 0 0; font-weight:bold; display:flex;align-items:center;">
      <span id="editor-filename"></span>
      <button id="editor-close" title="Close" style="margin-left:auto;background:none;border:none;color:#fff;font-size:1.2em;cursor:pointer;">&times;</button>
    </div>
    <textarea id="editor-textarea" style="flex:1; width:98%; height:180px; margin:10px 1%; background:#181; color:#33ff33; border:none; border-radius:4px; font-family:inherit; font-size:1em; resize:vertical; outline:none;"></textarea>
    <div class="editor-footer" style="padding: 8px 16px; display:flex;justify-content:flex-end;">
      <button id="editor-save" style="background:#00ff44;color:#000;font-weight:bold;padding:4px 18px;border:none;border-radius:4px;cursor:pointer;">Save</button>
      <button id="editor-cancel" style="margin-left:10px;background:#222;color:#fff;padding:4px 14px;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Drag logic
  const header = modal.querySelector('.editor-header');
  let isDragging = false, startX, startY, startLeft, startTop;
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = modal.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    document.body.style.userSelect = "none";
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    modal.style.left = `${startLeft + dx + modal.offsetWidth/2}px`;
    modal.style.top = `${startTop + dy + modal.offsetHeight/2}px`;
    modal.style.transform = `translate(-50%,-50%)`;
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });
}

const editor = {
  open(filePath, content, onSave) {
    createEditorModal();
    const modal = document.getElementById(editorModalId);
    const filenameSpan = modal.querySelector("#editor-filename");
    const textarea = modal.querySelector("#editor-textarea");
    const saveBtn = modal.querySelector("#editor-save");
    const cancelBtn = modal.querySelector("#editor-cancel");
    const closeBtn = modal.querySelector("#editor-close");

    filenameSpan.textContent = filePath;
    textarea.value = content;
    modal.style.display = "flex";
    textarea.focus();

    function closeEditor() {
      modal.style.display = "none";
      textarea.value = "";
    }

    saveBtn.onclick = () => {
      onSave(textarea.value);
      closeEditor();
    };
    cancelBtn.onclick = closeBtn.onclick = closeEditor;

    textarea.onkeydown = (e) => {
      if (e.key === "Escape") {
        closeEditor();
      } else if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSave(textarea.value);
        closeEditor();
      }
    };
  }
};

window.zeroshellEditor = editor;
export default editor;
