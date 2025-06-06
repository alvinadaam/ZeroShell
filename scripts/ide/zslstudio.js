// ZSL Studio: Floating IDE for ZeroShell
import vfsManager from '../tools/vfsManager.js';
import { escapeHTML } from '../tools/utils.js';
import { showInputModal } from '../ui/inputModal.js';

let studioModal = null;
let openTabs = [];
let activeTab = null;

function createStudioModal() {
  if (studioModal) return;
  studioModal = document.createElement('div');
  studioModal.id = 'zslstudio-modal';
  studioModal.style = `
    position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%);
    min-width: 540px; min-height: 340px; max-width: 90vw; max-height: 90vh;
    background: #181; color: #fff; border: 2px solid #00ff44; border-radius: 10px;
    z-index: 10010; display: flex; flex-direction: column; box-shadow: 0 0 32px #00ff44cc;
    resize: both; overflow: hidden;
  `;
  studioModal.innerHTML = `
    <div class="studio-header" style="display:flex;align-items:center;padding:8px 12px;background:#222;border-radius:10px 10px 0 0;">
      <span style="font-weight:bold;font-size:1.2em;color:#00ff44;">ZSL Studio</span>
      <div id="zslstudio-tabs" style="display:flex;gap:6px;margin-left:18px;flex:1;overflow-x:auto;"></div>
      <button id="zslstudio-open" title="Open file" style="margin-left:8px;">Open</button>
      <button id="zslstudio-new" title="New file" style="margin-left:4px;">New</button>
      <button id="zslstudio-run" title="Run" style="margin-left:8px;background:#00ff44;color:#000;">Run</button>
      <button id="zslstudio-close" title="Close" style="margin-left:12px;background:none;color:#fff;font-size:1.3em;">×</button>
    </div>
    <div id="zslstudio-editor-container" style="flex:1;display:flex;flex-direction:column;overflow:auto;">
      <textarea id="zslstudio-editor" spellcheck="false" style="flex:1;width:100%;height:100%;background:#111;color:#fff;font-family:monospace;font-size:1em;border:none;outline:none;padding:14px;resize:none;border-radius:0 0 10px 10px;"></textarea>
    </div>
    <div id="zslstudio-status" style="padding:6px 14px;font-size:0.95em;color:#00ff44;background:#191;border-radius:0 0 10px 10px;"></div>
  `;
  document.body.appendChild(studioModal);

  // Drag logic
  let isDragging = false, startX, startY, startLeft, startTop;
  const header = studioModal.querySelector('.studio-header');
  header.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = studioModal.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    document.body.style.userSelect = "none";
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    studioModal.style.left = `${startLeft + dx + studioModal.offsetWidth/2}px`;
    studioModal.style.top = `${startTop + dy + studioModal.offsetHeight/2}px`;
    studioModal.style.transform = `translate(-50%,-50%)`;
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });
}

function renderTabs() {
  const tabsDiv = studioModal.querySelector('#zslstudio-tabs');
  tabsDiv.innerHTML = '';
  openTabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab.name + (tab.unsaved ? '*' : '');
    btn.style = `padding:2px 10px;border-radius:4px;border:none;background:${tab === activeTab ? '#00ff44' : '#222'};color:${tab === activeTab ? '#000' : '#fff'};margin-right:2px;`;
    btn.onclick = () => { setActiveTab(tab); };
    tabsDiv.appendChild(btn);
  });
}

function setActiveTab(tab) {
  activeTab = tab;
  renderTabs();
  const editor = studioModal.querySelector('#zslstudio-editor');
  editor.value = tab.content;
  updateStatus();
}

function updateStatus(msg) {
  const status = studioModal.querySelector('#zslstudio-status');
  if (msg) status.textContent = msg;
  else if (activeTab) status.textContent = `Editing: ${activeTab.path || '(unsaved)'}${activeTab.unsaved ? ' (unsaved)' : ''}`;
  else status.textContent = '';
}

function simpleHighlight(code) {
  // Very basic: highlight keywords, numbers, strings
  return code
    .replace(/"(.*?)"/g, '<span style="color:#00bfff;">"$1"</span>')
    .replace(/\b(func|let|if|else|end|for|while|return|import|print|input)\b/g, '<span style="color:#00ff44;">$1</span>')
    .replace(/\b\d+\b/g, '<span style="color:#ffb300;">$&</span>');
}

function openFileTab(path, name, content) {
  let tab = openTabs.find(t => t.path === path);
  if (!tab) {
    tab = { path, name, content, unsaved: false };
    openTabs.push(tab);
  }
  setActiveTab(tab);
}

function saveActiveTab() {
  if (!activeTab) return;
  vfsManager.writeFile(activeTab.path, activeTab.content, { mime: "text/plain" });
  activeTab.unsaved = false;
  updateStatus("Saved.");
}

function runActiveTab() {
  if (!activeTab) return;
  // Simulate running: send to shell as if user typed run [file]
  const shellInput = document.getElementById('command-input');
  shellInput.value = `run ${activeTab.path}`;
  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
  shellInput.dispatchEvent(event);
  updateStatus("Running...");
}

const zslstudio = async function(args, shellState, vfsManager) {
  createStudioModal();
  studioModal.style.display = 'flex';

  // Tab logic
  if (openTabs.length === 0) {
    // Open a default new file
    openTabs.push({ path: '', name: 'untitled.zs', content: '', unsaved: false });
    setActiveTab(openTabs[0]);
  } else {
    setActiveTab(activeTab || openTabs[0]);
  }
  renderTabs();

  // Button logic
  studioModal.querySelector('#zslstudio-close').onclick = () => {
    studioModal.style.display = 'none';
  };
  studioModal.querySelector('#zslstudio-open').onclick = async () => {
    // Use custom modal for file path input
    const path = await showInputModal({ prompt: "Enter path to open (e.g. zslang/mathlib.zs):", mode: "modal" });
    if (!path) return;
    const node = await vfsManager.getNode(path);
    if (!node || node.type !== "file") {
      updateStatus("File not found.");
      return;
    }
    openFileTab(path, node.name, node.content);
  };
  studioModal.querySelector('#zslstudio-new').onclick = () => {
    openTabs.push({ path: '', name: 'untitled.zs', content: '', unsaved: false });
    setActiveTab(openTabs[openTabs.length - 1]);
  };
  studioModal.querySelector('#zslstudio-run').onclick = runActiveTab;

  // Editor logic
  const editor = studioModal.querySelector('#zslstudio-editor');
  editor.oninput = () => {
    if (!activeTab) return;
    activeTab.content = editor.value;
    activeTab.unsaved = true;
    updateStatus();
  };
  editor.onblur = saveActiveTab;

  // Simple syntax highlighting (preview only)
  editor.onkeyup = () => {
    // Could add a preview pane here in future
  };

  updateStatus();
};

export default zslstudio;
