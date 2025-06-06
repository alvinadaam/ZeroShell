// GFX Canvas handler for ZeroShell (robust, always single instance, proper close, no duplicates)

let gfxCanvas = null;
let gfxCtx = null;
let gfxContainer = null;
let closeBtn = null;

function ensureCanvas() {
  // Remove any old canvas/overlay if present
  const old = document.getElementById('gfx-canvas-container');
  if (old && old.parentNode) old.parentNode.removeChild(old);

  // Create container
  gfxContainer = document.createElement('div');
  gfxContainer.id = "gfx-canvas-container";
  gfxContainer.style = `
    position:fixed;bottom:32px;right:32px;z-index:10010;
    background:linear-gradient(135deg,#101c10 60%,#1e2e1e 100%);
    border:2.5px solid #00ff44;
    border-radius:18px;
    box-shadow:0 0 32px #00ff44cc,0 2px 24px #000b;
    padding:18px 18px 12px 18px;
    display:flex;flex-direction:column;align-items:center;
    min-width:360px;min-height:260px;
    transition:opacity 0.2s;
    font-family:monospace;
  `;

  // Close button
  closeBtn = document.createElement('button');
  closeBtn.textContent = "×";
  closeBtn.title = "Close graphics";
  closeBtn.style = `
    position:absolute;top:10px;right:16px;
    background:#222;color:#00ff44;border:none;
    border-radius:50%;width:32px;height:32px;
    font-size:1.5em;cursor:pointer;z-index:1001;
    box-shadow:0 0 12px #00ff44cc;
    transition:background 0.15s;
  `;
  closeBtn.onmouseenter = () => closeBtn.style.background = "#00ff44";
  closeBtn.onmouseleave = () => closeBtn.style.background = "#222";
  closeBtn.onclick = () => {
    if (gfxContainer && gfxContainer.parentNode) {
      gfxContainer.parentNode.removeChild(gfxContainer);
    }
    gfxCanvas = null;
    gfxCtx = null;
    gfxContainer = null;
    closeBtn = null;
  };
  gfxContainer.appendChild(closeBtn);

  // Canvas
  gfxCanvas = document.createElement('canvas');
  gfxCanvas.id = "gfx-canvas";
  gfxCanvas.width = 320;
  gfxCanvas.height = 240;
  gfxCanvas.style = `
    display: block;
    margin: 24px auto 0 auto;
    background: #181;
    border-radius: 10px;
    box-shadow: 0 0 16px #00ff44cc;
    border:1.5px solid #00ff44;
    outline: 2px solid #222;
    transition:box-shadow 0.2s;
  `;
  gfxContainer.appendChild(gfxCanvas);

  // Label
  const label = document.createElement('div');
  label.textContent = "Graphics Output";
  label.style = "margin-top:10px;color:#00ff44;font-size:1.08em;letter-spacing:0.04em;";
  gfxContainer.appendChild(label);

  document.body.appendChild(gfxContainer);

  gfxCtx = gfxCanvas.getContext('2d');
}

function show() {
  if (!document.getElementById('gfx-canvas-container')) {
    ensureCanvas();
  }
  gfxContainer.style.display = "flex";
  gfxContainer.focus();
  gfxCtx = gfxCanvas.getContext('2d');
}

function clear(r = 0, g = 0, b = 0) {
  show();
  gfxCtx.clearRect(0, 0, gfxCanvas.width, gfxCanvas.height);
  gfxCtx.fillStyle = `rgb(${r},${g},${b})`;
  gfxCtx.fillRect(0, 0, gfxCanvas.width, gfxCanvas.height);
}

function setPixel(x, y, r = 255, g = 255, b = 255) {
  show();
  gfxCtx.fillStyle = `rgb(${r},${g},${b})`;
  gfxCtx.fillRect(x, y, 1, 1);
}

function drawRect(x, y, w, h, r = 255, g = 255, b = 255) {
  show();
  gfxCtx.fillStyle = `rgb(${r},${g},${b})`;
  gfxCtx.fillRect(x, y, w, h);
}

function drawLine(x1, y1, x2, y2, r = 255, g = 255, b = 255) {
  show();
  gfxCtx.strokeStyle = `rgb(${r},${g},${b})`;
  gfxCtx.beginPath();
  gfxCtx.moveTo(x1, y1);
  gfxCtx.lineTo(x2, y2);
  gfxCtx.stroke();
}

function drawCircle(x, y, radius, r = 255, g = 255, b = 255) {
  show();
  gfxCtx.fillStyle = `rgb(${r},${g},${b})`;
  gfxCtx.beginPath();
  gfxCtx.arc(x, y, radius, 0, 2 * Math.PI);
  gfxCtx.fill();
}

function text(txt, x, y, size = 16, r = 255, g = 255, b = 255) {
  show();
  gfxCtx.font = `${size}px monospace`;
  gfxCtx.fillStyle = `rgb(${r},${g},${b})`;
  gfxCtx.fillText(txt, x, y);
}

// Export all functions for use in compilerEngine.js
export { show, clear, setPixel, drawRect, drawLine, drawCircle, text };
